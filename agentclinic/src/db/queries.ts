import type { Db } from './index'
import type {
  Agent,
  AgentAilment,
  AilmentWithCount,
  Appointment,
  DashboardStats,
  LocalDateTime,
  Therapy,
} from './types'

export function listAgents(db: Db): Agent[] {
  return db.prepare('SELECT * FROM agents ORDER BY name').all() as Agent[]
}

export function getAgent(db: Db, id: number): Agent | undefined {
  return db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
}

export function listAgentsInTreatment(db: Db): Agent[] {
  return db.prepare("SELECT * FROM agents WHERE status = 'in-treatment' ORDER BY name").all() as Agent[]
}

export function listAilmentsForAgent(db: Db, agentId: number): AgentAilment[] {
  return db
    .prepare(
      `SELECT a.*, aa.diagnosed_on, t.name AS therapy_name
       FROM agent_ailments aa
       JOIN ailments a ON a.id = aa.ailment_id
       LEFT JOIN therapies t ON t.id = aa.therapy_id
       WHERE aa.agent_id = ?
       ORDER BY aa.diagnosed_on`,
    )
    .all(agentId) as AgentAilment[]
}

export function listAilments(db: Db): AilmentWithCount[] {
  return db
    .prepare(
      `SELECT a.*, COUNT(aa.agent_id) AS agent_count
       FROM ailments a
       LEFT JOIN agent_ailments aa ON aa.ailment_id = a.id
       GROUP BY a.id
       ORDER BY a.name`,
    )
    .all() as AilmentWithCount[]
}

export function listTherapies(db: Db): Therapy[] {
  return db.prepare('SELECT * FROM therapies ORDER BY name').all() as Therapy[]
}

export function getTherapy(db: Db, id: number): Therapy | undefined {
  return db.prepare('SELECT * FROM therapies WHERE id = ?').get(id) as Therapy | undefined
}

const APPOINTMENT_SELECT = `
  SELECT ap.*, ag.name AS agent_name, t.name AS therapy_name
  FROM appointments ap
  JOIN agents ag ON ag.id = ap.agent_id
  LEFT JOIN therapies t ON t.id = ap.therapy_id
`

export function listUpcomingAppointments(db: Db, now: LocalDateTime, limit = 100): Appointment[] {
  return db
    .prepare(`${APPOINTMENT_SELECT} WHERE ap.starts_at >= ? ORDER BY ap.starts_at LIMIT ?`)
    .all(now, limit) as Appointment[]
}

export function listUpcomingAppointmentsForAgent(db: Db, agentId: number, now: LocalDateTime): Appointment[] {
  return db
    .prepare(`${APPOINTMENT_SELECT} WHERE ap.agent_id = ? AND ap.starts_at >= ? ORDER BY ap.starts_at`)
    .all(agentId, now) as Appointment[]
}

export function hasAppointmentAt(db: Db, agentId: number, startsAt: LocalDateTime): boolean {
  return db.prepare('SELECT 1 FROM appointments WHERE agent_id = ? AND starts_at = ?').get(agentId, startsAt) !== undefined
}

export type NewAppointment = {
  agent_id: number
  therapy_id: number | null
  starts_at: LocalDateTime
  notes: string
}

export function createAppointment(db: Db, appt: NewAppointment): number {
  const result = db
    .prepare('INSERT INTO appointments (agent_id, therapy_id, starts_at, notes) VALUES (?, ?, ?, ?)')
    .run(appt.agent_id, appt.therapy_id, appt.starts_at, appt.notes)
  return Number(result.lastInsertRowid)
}

export function getDashboardStats(db: Db, now: LocalDateTime): DashboardStats {
  const one = (sql: string, ...params: string[]) => (db.prepare(sql).get(...params) as { n: number }).n
  return {
    agents: one('SELECT COUNT(*) AS n FROM agents'),
    in_treatment: one("SELECT COUNT(*) AS n FROM agents WHERE status = 'in-treatment'"),
    diagnosed_ailments: one('SELECT COUNT(*) AS n FROM agent_ailments'),
    upcoming_appointments: one('SELECT COUNT(*) AS n FROM appointments WHERE starts_at >= ?', now),
  }
}
