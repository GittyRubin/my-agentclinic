export type AgentStatus = 'active' | 'in-treatment' | 'recovered'

export type Agent = {
  id: number
  name: string
  model: string
  status: AgentStatus
  joined_on: string
}

export type Severity = 'mild' | 'moderate' | 'severe'

export type Ailment = {
  id: number
  name: string
  description: string
  severity: Severity
}

export type AgentAilment = Ailment & {
  diagnosed_on: string
}

export type AilmentWithCount = Ailment & {
  agent_count: number
}
