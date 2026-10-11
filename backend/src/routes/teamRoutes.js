const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const supabaseService = require('../services/supabaseService');

// GET /api/teams/my-team
router.get('/my-team', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    let team = db.prepare(`
      SELECT t.*, u.name as leader_name, ps.title as problem_title, ps.category as problem_category
      FROM teams t
      LEFT JOIN users u ON t.leader_id = u.id
      LEFT JOIN problem_statements ps ON t.problem_statement_id = ps.id
      WHERE t.leader_id = ?
    `).get(userId);

    if (!team) {
      const memberRecord = db.prepare('SELECT team_id FROM team_members WHERE email = ?').get(req.user.email);
      if (memberRecord) {
        team = db.prepare(`
          SELECT t.*, u.name as leader_name, ps.title as problem_title, ps.category as problem_category
          FROM teams t
          LEFT JOIN users u ON t.leader_id = u.id
          LEFT JOIN problem_statements ps ON t.problem_statement_id = ps.id
          WHERE t.id = ?
        `).get(memberRecord.team_id);
      }
    }

    if (!team) {
      return res.json({ success: true, hasTeam: false, team: null });
    }

    const members = db.prepare('SELECT * FROM team_members WHERE team_id = ?').all(team.id);
    const submission = db.prepare('SELECT * FROM submissions WHERE team_id = ?').get(team.id);

    const femaleCount = members.filter(m => m.gender && m.gender.toLowerCase() === 'female').length;
    const isCompliant = members.length >= 3 && members.length <= 6;

    res.json({
      success: true,
      hasTeam: true,
      team: {
        ...team,
        members,
        submission,
        femaleCount,
        isCompliant
      }
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ success: false, error: 'Server error retrieving team info' });
  }
});

// POST /api/teams/create
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, college, track, members } = req.body;
    const leaderId = req.user.id;

    if (!name || !college) {
      return res.status(400).json({ success: false, error: 'Team name and college are required' });
    }

    const existingTeam = db.prepare('SELECT id FROM teams WHERE name = ?').get(name);
    if (existingTeam) {
      return res.status(400).json({ success: false, error: 'Team name is already registered' });
    }

    const teamId = 'team-' + uuidv4().slice(0, 8);

    db.prepare(`
      INSERT INTO teams (id, name, leader_id, college, track, status)
      VALUES (?, ?, ?, ?, ?, 'forming')
    `).run(teamId, name, leaderId, college, track || 'Software');

    const teamObj = {
      id: teamId,
      name,
      leader_id: leaderId,
      college,
      track: track || 'Software',
      status: 'forming'
    };

    // Sync team to Supabase
    supabaseService.syncTeam(teamObj);

    // Add leader as member
    const leaderMember = {
      id: uuidv4(),
      team_id: teamId,
      name: req.user.name,
      email: req.user.email,
      role_in_team: 'Team Leader',
      gender: 'Other',
      college_id_no: 'LEADER001',
      year_of_study: '3rd Year'
    };

    db.prepare(`
      INSERT INTO team_members (id, team_id, name, email, role_in_team, gender, college_id_no, year_of_study)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(leaderMember.id, leaderMember.team_id, leaderMember.name, leaderMember.email, leaderMember.role_in_team, leaderMember.gender, leaderMember.college_id_no, leaderMember.year_of_study);

    supabaseService.syncTeamMember(leaderMember);

    // Add invited members if provided
    if (Array.isArray(members) && members.length > 0) {
      const insertMember = db.prepare(`
        INSERT INTO team_members (id, team_id, name, email, role_in_team, gender, college_id_no, year_of_study)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const m of members) {
        if (m.name && m.email) {
          const mObj = {
            id: uuidv4(),
            team_id: teamId,
            name: m.name,
            email: m.email,
            role_in_team: m.role_in_team || 'Developer',
            gender: m.gender || 'Male',
            college_id_no: m.college_id_no || '',
            year_of_study: m.year_of_study || '3rd Year'
          };
          insertMember.run(mObj.id, mObj.team_id, mObj.name, mObj.email, mObj.role_in_team, mObj.gender, mObj.college_id_no, mObj.year_of_study);
          supabaseService.syncTeamMember(mObj);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Team created successfully and synced to Supabase',
      teamId
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ success: false, error: 'Failed to create team' });
  }
});

// POST /api/teams/select-problem (Lock problem statement for team in Supabase)
router.post('/select-problem', async (req, res) => {
  try {
    const { problemId } = req.body;
    const userId = req.user?.id;

    let team;
    if (userId) {
      team = db.prepare('SELECT * FROM teams WHERE leader_id = ?').get(userId);
    }
    
    if (!team) {
      team = db.prepare('SELECT * FROM teams ORDER BY created_at DESC LIMIT 1').get();
    }

    if (!team) {
      return res.status(400).json({ success: false, error: 'Team record not found. Please create a team first.' });
    }

    const ps = db.prepare('SELECT id FROM problem_statements WHERE id = ? AND is_active = 1').get(problemId);
    if (!ps) {
      return res.status(404).json({ success: false, error: 'Problem statement not found or inactive' });
    }

    db.prepare('UPDATE teams SET problem_statement_id = ? WHERE id = ?').run(problemId, team.id);

    // Map Problem Statement selection in Supabase
    supabaseService.mapTeamProblem(team.id, problemId);

    res.json({
      success: true,
      message: 'Problem statement mapped to team in Supabase successfully',
      teamId: team.id,
      problemId
    });
  } catch (error) {
    console.error('Select problem error:', error);
    res.status(500).json({ success: false, error: 'Failed to assign problem statement' });
  }
});

// POST /api/teams/add-member
router.post('/add-member', authenticateToken, async (req, res) => {
  try {
    const { name, email, role_in_team, gender, college_id_no, year_of_study } = req.body;
    const userId = req.user.id;

    const team = db.prepare('SELECT id FROM teams WHERE leader_id = ?').get(userId);
    if (!team) {
      return res.status(400).json({ success: false, error: 'Only team leader can add members' });
    }

    const currentCount = db.prepare('SELECT COUNT(*) as count FROM team_members WHERE team_id = ?').get(team.id).count;
    if (currentCount >= 6) {
      return res.status(400).json({ success: false, error: 'Maximum team size of 6 members reached' });
    }

    const mObj = {
      id: uuidv4(),
      team_id: team.id,
      name,
      email,
      role_in_team: role_in_team || 'Developer',
      gender: gender || 'Male',
      college_id_no: college_id_no || '',
      year_of_study: year_of_study || '3rd Year'
    };

    db.prepare(`
      INSERT INTO team_members (id, team_id, name, email, role_in_team, gender, college_id_no, year_of_study)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(mObj.id, mObj.team_id, mObj.name, mObj.email, mObj.role_in_team, mObj.gender, mObj.college_id_no, mObj.year_of_study);

    supabaseService.syncTeamMember(mObj);

    res.status(201).json({ success: true, message: 'Team member added and synced to Supabase', memberId: mObj.id });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add member' });
  }
});

module.exports = router;
