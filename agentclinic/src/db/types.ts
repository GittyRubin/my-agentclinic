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
  therapy_name: string | null
}

export type AilmentWithCount = Ailment & {
  agent_count: number
}

export type Therapy = {
  id: number
  name: string
  description: string
  duration_minutes: number
}

/** Local date-time as `YYYY-MM-DDTHH:MM` (HTML datetime-local format). */
export type LocalDateTime = string

export type Appointment = {
  id: number
  agent_id: number
  agent_name: string
  therapy_id: number | null
  therapy_name: string | null
  starts_at: LocalDateTime
  notes: string
}

export type AppointmentInput = {
  agent_id: string
  therapy_id: string
  starts_at: string
  notes: string
}

export type DashboardStats = {
  agents: number
  in_treatment: number
  diagnosed_ailments: number
  upcoming_appointments: number
}
