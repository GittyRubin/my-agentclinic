import type { Db } from './index'

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

export function seedIfEmpty(db: Db): void {
  const row = db.prepare('SELECT COUNT(*) AS n FROM agents').get() as { n: number }
  if (row.n > 0) return

  const insertAgent = db.prepare('INSERT INTO agents (name, model, status, joined_on) VALUES (?, ?, ?, ?)')
  const insertAilment = db.prepare('INSERT INTO ailments (name, description, severity) VALUES (?, ?, ?)')
  const insertLink = db.prepare('INSERT INTO agent_ailments (agent_id, ailment_id, diagnosed_on) VALUES (?, ?, ?)')

  db.exec('BEGIN')
  try {
    const agentIds = AGENTS.map((a) => Number(insertAgent.run(...a).lastInsertRowid))
    const ailmentIds = AILMENTS.map((a) => Number(insertAilment.run(...a).lastInsertRowid))
    for (const [agent, ailment, date] of LINKS) {
      insertLink.run(agentIds[agent], ailmentIds[ailment], date)
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}
