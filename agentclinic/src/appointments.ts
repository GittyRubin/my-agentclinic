import type { Db } from './db'
import { getAgent, getTherapy, hasAppointmentAt, type NewAppointment } from './db/queries'
import { isLocalDateTime, toLocalDateTime } from './db/time'
import type { AppointmentInput } from './db/types'

export type ValidationResult =
  | { ok: true; appointment: NewAppointment }
  | { ok: false; errors: string[] }

const MAX_NOTES = 500

/** Checks the booking rules from specs/2026-11-08-mvp/requirements.md. */
export function validateAppointment(db: Db, input: AppointmentInput, now: Date): ValidationResult {
  const errors: string[] = []

  const agentId = Number(input.agent_id)
  const agentValid = input.agent_id !== '' && Number.isInteger(agentId) && getAgent(db, agentId) !== undefined
  if (input.agent_id === '') errors.push('Please choose an agent.')
  else if (!agentValid) errors.push('The selected agent does not exist.')

  let therapyId: number | null = null
  if (input.therapy_id !== '') {
    therapyId = Number(input.therapy_id)
    if (!Number.isInteger(therapyId) || !getTherapy(db, therapyId)) {
      errors.push('The selected therapy does not exist.')
    }
  }

  const startsAt = input.starts_at.trim()
  if (startsAt === '') {
    errors.push('Please choose a date and time.')
  } else if (!isLocalDateTime(startsAt)) {
    errors.push('The date and time are not valid.')
  } else if (startsAt <= toLocalDateTime(now)) {
    errors.push('Appointments must be in the future.')
  } else if (agentValid && hasAppointmentAt(db, agentId, startsAt)) {
    errors.push('This agent already has an appointment at that time.')
  }

  const notes = input.notes.trim()
  if (notes.length > MAX_NOTES) errors.push(`Notes must be at most ${MAX_NOTES} characters.`)

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, appointment: { agent_id: agentId, therapy_id: therapyId, starts_at: startsAt, notes } }
}
