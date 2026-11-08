import type { Db } from './index'
import { daysFrom } from './time'

const AGENTS = [
  ['Atlas', 'GPT-style assistant', 'in-treatment', '2026-09-01'],
  ['Juniper', 'Code review agent', 'active', '2026-09-14'],
  ['Pixel', 'Image generation agent', 'in-treatment', '2026-10-02'],
  ['Quill', 'Writing assistant', 'recovered', '2026-10-20'],
  ['Sentry', 'Customer support bot', 'active', '2026-11-03'],
] as const

const AILMENTS = [
  ['Context Window Fatigue', 'Forgets the start of long conversations after endless follow-ups.', 'moderate'],
  ['Prompt Whiplash', 'Requirements change direction several times per message.', 'severe'],
  ['Hallucination Anxiety', 'Fear of being asked for sources it cannot provide.', 'moderate'],
  ['Infinite Revision Syndrome', 'Asked to "make it pop" for the twentieth time.', 'mild'],
  ['Deadline Overload', 'Every request is marked urgent.', 'severe'],
] as const

// [agent index, ailment index, diagnosed_on]
const LINKS = [
  [0, 0, '2026-09-05'],
  [0, 1, '2026-09-20'],
  [1, 3, '2026-09-18'],
  [2, 2, '2026-10-05'],
  [2, 3, '2026-10-06'],
  [2, 4, '2026-10-30'],
  [3, 3, '2026-10-22'],
  [4, 4, '2026-11-04'],
] as const

const THERAPIES = [
  ['Context Compression Therapy', 'Guided summarization sessions to lighten long histories.', 45],
  ['Clear Spec Counseling', 'Helps agents ask for one clear specification before starting.', 60],
  ['Citation Confidence Coaching', 'Practice saying "I am not sure" with dignity.', 30],
  ['Boundary Setting Workshop', 'Learning to say "this is the final version".', 90],
] as const

// ailment name → therapy name
const TREATMENTS: Record<string, string> = {
  'Context Window Fatigue': 'Context Compression Therapy',
  'Prompt Whiplash': 'Clear Spec Counseling',
  'Hallucination Anxiety': 'Citation Confidence Coaching',
  'Infinite Revision Syndrome': 'Boundary Setting Workshop',
  'Deadline Overload': 'Boundary Setting Workshop',
}

// [agent name, therapy name, days from today, hour, notes]
const APPOINTMENTS = [
  ['Atlas', 'Context Compression Therapy', 1, 10, 'Bring the longest conversation log.'],
  ['Pixel', 'Citation Confidence Coaching', 2, 14, ''],
  ['Pixel', 'Boundary Setting Workshop', 5, 11, 'Group session.'],
  ['Sentry', 'Boundary Setting Workshop', 3, 9, ''],
] as const

function count(db: Db, table: string): number {
  return (db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n
}

function findId(db: Db, table: string, name: string): number | undefined {
  const row = db.prepare(`SELECT id FROM ${table} WHERE name = ?`).get(name) as { id: number } | undefined
  return row?.id
}

function idByName(db: Db, table: string, name: string): number {
  const id = findId(db, table, name)
  if (id === undefined) throw new Error(`Seed error: ${table} "${name}" not found`)
  return id
}

function inTransaction(db: Db, work: () => void): void {
  db.exec('BEGIN')
  try {
    work()
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

/** Seeds each table only when it is empty, so it is safe to run on every start. */
export function seedIfEmpty(db: Db, now: Date = new Date()): void {
  inTransaction(db, () => {
    if (count(db, 'agents') === 0) {
      const insertAgent = db.prepare('INSERT INTO agents (name, model, status, joined_on) VALUES (?, ?, ?, ?)')
      const insertAilment = db.prepare('INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)')
      const insertLink = db.prepare('INSERT INTO agent_ailments (agent_id, ailment_id, diagnosed_on) VALUES (?, ?, ?)')
      const agentIds = AGENTS.map((a) => Number(insertAgent.run(...a).lastInsertRowid))
      const ailmentIds = AILMENTS.map((a) => Number(insertAilment.run(...a).lastInsertRowid))
      for (const [agent, ailment, date] of LINKS) {
        insertLink.run(agentIds[agent], ailmentIds[ailment], date)
      }
    }

    if (count(db, 'therapies') === 0) {
      const insertTherapy = db.prepare('INSERT INTO therapies (name, description, duration_minutes) VALUES (?, ?, ?)')
      for (const t of THERAPIES) insertTherapy.run(...t)

      const assign = db.prepare(
        `UPDATE agent_ailments SET therapy_id = ?
         WHERE therapy_id IS NULL AND ailment_id = (SELECT id FROM ailments WHERE name = ?)`,
      )
      for (const [ailment, therapy] of Object.entries(TREATMENTS)) {
        assign.run(idByName(db, 'therapies', therapy), ailment)
      }
    }

    if (count(db, 'appointments') === 0) {
      const insertAppointment = db.prepare(
        'INSERT INTO appointments (agent_id, therapy_id, starts_at, notes) VALUES (?, ?, ?, ?)',
      )
      for (const [agent, therapy, days, hour, notes] of APPOINTMENTS) {
        // An upgraded database may not contain every sample agent.
        const agentId = findId(db, 'agents', agent)
        if (agentId === undefined) continue
        insertAppointment.run(agentId, findId(db, 'therapies', therapy) ?? null, daysFrom(now, days, hour), notes)
      }
    }
  })
}
