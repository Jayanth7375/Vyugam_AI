const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'vyugam_hackathon.db');
const db = new Database(dbPath);

// Enable SQLite WAL mode for fast concurrency (supports high throughput for 3000+ users)
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

function initDb() {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'evaluator', 'admin')),
      college TEXT DEFAULT 'Vyugam Institute of Technology',
      department TEXT DEFAULT 'Computer Science & Engineering',
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Problem Statements Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS problem_statements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      domain_bucket TEXT NOT NULL,
      organization TEXT NOT NULL,
      description TEXT NOT NULL,
      desired_outcome TEXT NOT NULL,
      complexity TEXT NOT NULL,
      dataset_url TEXT,
      submissions_count INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_ps_category ON problem_statements(category);
    CREATE INDEX IF NOT EXISTS idx_ps_domain ON problem_statements(domain_bucket);
  `);

  // Teams Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      leader_id TEXT NOT NULL,
      college TEXT NOT NULL,
      track TEXT NOT NULL,
      problem_statement_id TEXT,
      status TEXT DEFAULT 'forming' CHECK(status IN ('forming', 'submitted', 'shortlisted', 'finalist', 'winner')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(leader_id) REFERENCES users(id),
      FOREIGN KEY(problem_statement_id) REFERENCES problem_statements(id)
    );
  `);

  // Team Members Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role_in_team TEXT NOT NULL,
      gender TEXT NOT NULL,
      college_id_no TEXT,
      year_of_study TEXT,
      FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
    );
  `);

  // Submissions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      team_id TEXT UNIQUE NOT NULL,
      problem_statement_id TEXT NOT NULL,
      idea_title TEXT NOT NULL,
      executive_summary TEXT NOT NULL,
      proposed_solution TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      ppt_url TEXT,
      github_url TEXT,
      demo_video_url TEXT,
      status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted', 'under_review', 'shortlisted', 'rejected', 'winner')),
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(team_id) REFERENCES teams(id),
      FOREIGN KEY(problem_statement_id) REFERENCES problem_statements(id)
    );
    CREATE INDEX IF NOT EXISTS idx_sub_ps ON submissions(problem_statement_id);
    CREATE INDEX IF NOT EXISTS idx_sub_team ON submissions(team_id);
  `);

  // Evaluations Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL,
      evaluator_id TEXT NOT NULL,
      innovation_score INTEGER NOT NULL,
      technical_score INTEGER NOT NULL,
      feasibility_score INTEGER NOT NULL,
      ui_ux_score INTEGER NOT NULL,
      presentation_score INTEGER NOT NULL,
      total_score INTEGER NOT NULL,
      comments TEXT,
      decision TEXT NOT NULL CHECK(decision IN ('Shortlist', 'Reject', 'Under Review')),
      evaluated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(submission_id) REFERENCES submissions(id),
      FOREIGN KEY(evaluator_id) REFERENCES users(id)
    );
  `);

  // Announcements Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      is_banner INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Contact Messages Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Password Resets Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      otp TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_pw_reset_email ON password_resets(email);
  `);

  console.log('SQLite WAL database initialized successfully.');
}

module.exports = { db, initDb };
