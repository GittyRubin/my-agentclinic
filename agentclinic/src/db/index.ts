import { DatabaseSync } from 'node:sqlite'

export type Db = DatabaseSync

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'in-treatment', 'recovered')),
    joined_on TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ailments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe'))
  );

  CREATE TABLE IF NOT EXISTS therapies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0)
  );

  CREATE TABLE IF NOT EXISTS agent_ailments (
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    ailment_id INTEGER NOT NULL REFERENCES ailments(id),
    diagnosed_on TEXT NOT NULL,
    therapy_id INTEGER REFERENCES therapies(id),
    PRIMARY KEY (agent_id, ailment_id)
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    therapy_id INTEGER REFERENCES therapies(id),
    starts_at TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    UNIQUE (agent_id, starts_at)
  );
`

function hasColumn(db: Db, table: string, column: string): boolean {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]
  return columns.some((c) => c.name === column)
}

/** Upgrades databases created before the MVP. */
function migrate(db: Db): void {
  if (!hasColumn(db, 'agent_ailments', 'therapy_id')) {
    db.exec('ALTER TABLE agent_ailments ADD COLUMN therapy_id INTEGER REFERENCES therapies(id)')
  }
}

export function openDb(path: string): Db {
  const db = new DatabaseSync(path)
  db.exec('PRAGMA foreign_keys = ON;')
  db.exec(SCHEMA)
  migrate(db)
  return db
}
