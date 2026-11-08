import type { Db } from './index'
import type { Agent, AgentAilment, AilmentWithCount } from './types'

export function listAgents(db: Db): Agent[] {
  return db.prepare('SELECT * FROM agents ORDER BY name').all() as Agent[]
}

export function getAgent(db: Db, id: number): Agent | undefined {
  return db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
}

export function listAilmentsForAgent(db: Db, agentId: number): AgentAilment[] {
  return db
    .prepare(
      `SELECT a.*, aa.diagnosed_on
       FROM agent_ailments aa
       JOIN ailments a ON a.id = aa.ailment_id
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
