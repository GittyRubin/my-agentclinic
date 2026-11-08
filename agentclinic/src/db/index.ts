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

  CREATE TABLE IF NOT EXISTS agent_ailments (
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    ailment_id INTEGER NOT NULL REFERENCES ailments(id),
    diagnosed_on TEXT NOT NULL,
    PRIMARY KEY (agent_id, ailment_id)
  );
`

export function openDb(path: string): Db {
  const db = new DatabaseSync(path)
  db.exec('PRAGMA foreign_keys = ON;')
  db.exec(SCHEMA)
  return db
}
