const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'sirak.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    studio_type TEXT,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    duration_hours INTEGER NOT NULL DEFAULT 1,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    total_estimate REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blocked_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    studio_type TEXT,
    reason TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
  CREATE INDEX IF NOT EXISTS idx_blocked_dates ON blocked_dates(date);
  CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    source TEXT NOT NULL DEFAULT 'website',
    stage TEXT NOT NULL DEFAULT 'new',
    service_interest TEXT,
    estimated_value REAL,
    consultation_date TEXT,
    consultation_time TEXT,
    notes TEXT,
    booking_id INTEGER,
    contact_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS lead_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS webhook_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    events TEXT NOT NULL DEFAULT 'all',
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
  CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
  CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);
`);

// Seed admin user (password: sirak2026 — hashed with simple approach for demo)
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('sirak2026').digest('hex');

const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!existing) {
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('Admin user created (username: admin, password: sirak2026)');
}

console.log('Database initialized successfully at', path.join(__dirname, 'sirak.db'));
db.close();
