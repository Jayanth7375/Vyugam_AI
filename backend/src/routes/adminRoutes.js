const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/admin/stats (Comprehensive Hackathon Stats for 3000+ users monitoring)
router.get('/stats', authenticateToken, authorizeRoles('admin'), (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
    const totalEvaluators = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'evaluator'").get().count;
    const totalTeams = db.prepare('SELECT COUNT(*) as count FROM teams').get().count;
    const totalSubmissions = db.prepare('SELECT COUNT(*) as count FROM submissions').get().count;
    const totalEvaluated = db.prepare('SELECT COUNT(DISTINCT submission_id) as count FROM evaluations').get().count;
    const totalProblemStatements = db.prepare('SELECT COUNT(*) as count FROM problem_statements').get().count;

    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as ps_count, SUM(submissions_count) as total_subs
      FROM problem_statements
      GROUP BY category
    `).all();

    const topTeams = db.prepare(`
      SELECT 
        t.name as team_name,
        t.college,
        s.idea_title,
        ps.title as ps_title,
        AVG(e.total_score) as avg_score,
        COUNT(e.id) as eval_count
      FROM evaluations e
      JOIN submissions s ON e.submission_id = s.id
      JOIN teams t ON s.team_id = t.id
      JOIN problem_statements ps ON s.problem_statement_id = ps.id
      GROUP BY s.id
      ORDER BY avg_score DESC
      LIMIT 10
    `).all();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalEvaluators,
        totalTeams,
        totalSubmissions,
        totalEvaluated,
        totalProblemStatements
      },
      categoryStats,
      topTeams
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve admin statistics' });
  }
});

// GET /api/admin/teams (List all teams with member counts and statuses)
router.get('/teams', authenticateToken, authorizeRoles('admin'), (req, res) => {
  try {
    const teams = db.prepare(`
      SELECT 
        t.*,
        u.name as leader_name,
        u.email as leader_email,
        ps.title as ps_title,
        (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) as member_count
      FROM teams t
      LEFT JOIN users u ON t.leader_id = u.id
      LEFT JOIN problem_statements ps ON t.problem_statement_id = ps.id
      ORDER BY t.created_at DESC
    `).all();

    res.json({ success: true, count: teams.length, teams });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch teams' });
  }
});

// POST /api/admin/announcements (Create new announcement banner)
router.post('/announcements', authenticateToken, authorizeRoles('admin'), (req, res) => {
  try {
    const { title, message, category, is_banner } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Title and message are required' });
    }

    const id = 'ann-' + uuidv4().slice(0, 8);
    db.prepare(`
      INSERT INTO announcements (id, title, message, category, is_banner)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, title, message, category || 'General', is_banner ? 1 : 0);

    res.status(201).json({ success: true, message: 'Announcement created', id });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create announcement' });
  }
});

module.exports = router;
