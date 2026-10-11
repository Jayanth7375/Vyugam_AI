const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const supabaseService = require('../services/supabaseService');

// GET /api/evaluator/queue
router.get('/queue', authenticateToken, authorizeRoles('evaluator', 'admin'), (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT 
        s.*,
        t.name as team_name,
        t.college as team_college,
        ps.title as ps_title,
        ps.category as ps_category,
        ps.organization as ps_organization,
        (SELECT COUNT(*) FROM evaluations e WHERE e.submission_id = s.id) as evaluation_count,
        (SELECT AVG(total_score) FROM evaluations e WHERE e.submission_id = s.id) as avg_score
      FROM submissions s
      JOIN teams t ON s.team_id = t.id
      JOIN problem_statements ps ON s.problem_statement_id = ps.id
      ORDER BY s.submitted_at DESC
    `).all();

    res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    console.error('Error fetching evaluation queue:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch submissions for evaluation' });
  }
});

// GET /api/evaluator/submission/:id
router.get('/submission/:id', authenticateToken, authorizeRoles('evaluator', 'admin'), (req, res) => {
  try {
    const subId = req.params.id;
    const submission = db.prepare(`
      SELECT s.*, t.name as team_name, t.college as team_college, ps.title as ps_title, ps.description as ps_desc, ps.category as ps_category
      FROM submissions s
      JOIN teams t ON s.team_id = t.id
      JOIN problem_statements ps ON s.problem_statement_id = ps.id
      WHERE s.id = ?
    `).get(subId);

    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    const teamMembers = db.prepare('SELECT name, role_in_team, gender, college_id_no FROM team_members WHERE team_id = ?').all(submission.team_id);
    const existingEvaluation = db.prepare('SELECT * FROM evaluations WHERE submission_id = ? AND evaluator_id = ?').get(subId, req.user.id);
    const allEvaluations = db.prepare(`
      SELECT e.*, u.name as evaluator_name
      FROM evaluations e
      JOIN users u ON e.evaluator_id = u.id
      WHERE e.submission_id = ?
    `).all(subId);

    res.json({
      success: true,
      submission,
      teamMembers,
      existingEvaluation,
      allEvaluations
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch submission details' });
  }
});

// POST /api/evaluator/score (Submit score and sync to Supabase)
router.post('/score', authenticateToken, authorizeRoles('evaluator', 'admin'), async (req, res) => {
  try {
    const { submission_id, innovation_score, technical_score, feasibility_score, ui_ux_score, presentation_score, comments, decision } = req.body;
    const evaluatorId = req.user.id;

    if (!submission_id || decision == null) {
      return res.status(400).json({ success: false, error: 'Submission ID and decision are required' });
    }

    const total_score = (Number(innovation_score) || 0) + (Number(technical_score) || 0) + (Number(feasibility_score) || 0) + (Number(ui_ux_score) || 0) + (Number(presentation_score) || 0);

    const existing = db.prepare('SELECT id FROM evaluations WHERE submission_id = ? AND evaluator_id = ?').get(submission_id, evaluatorId);

    let evalId;
    if (existing) {
      evalId = existing.id;
      db.prepare(`
        UPDATE evaluations 
        SET innovation_score = ?, technical_score = ?, feasibility_score = ?, ui_ux_score = ?, presentation_score = ?, total_score = ?, comments = ?, decision = ?, evaluated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(innovation_score, technical_score, feasibility_score, ui_ux_score, presentation_score, total_score, comments || '', decision, existing.id);
    } else {
      evalId = uuidv4();
      db.prepare(`
        INSERT INTO evaluations (id, submission_id, evaluator_id, innovation_score, technical_score, feasibility_score, ui_ux_score, presentation_score, total_score, comments, decision)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(evalId, submission_id, evaluatorId, innovation_score, technical_score, feasibility_score, ui_ux_score, presentation_score, total_score, comments || '', decision);
    }

    if (decision === 'Shortlist') {
      db.prepare("UPDATE submissions SET status = 'shortlisted' WHERE id = ?").run(submission_id);
    } else if (decision === 'Reject') {
      db.prepare("UPDATE submissions SET status = 'rejected' WHERE id = ?").run(submission_id);
    }

    const evalObj = {
      id: evalId,
      submission_id,
      evaluator_id: evaluatorId,
      innovation_score,
      technical_score,
      feasibility_score,
      ui_ux_score,
      presentation_score,
      total_score,
      comments: comments || '',
      decision
    };

    // Sync score to Supabase
    supabaseService.syncEvaluation(evalObj);

    res.json({
      success: true,
      message: 'Evaluation saved and synced to Supabase',
      total_score,
      decision
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ success: false, error: 'Failed to record evaluation' });
  }
});

module.exports = router;
