import type { Appointment } from '../db/types'
import { formatDateTime } from '../db/time'

export type AppointmentsListProps = {
  appointments: Appointment[]
  showAgent?: boolean
}

export const AppointmentsList = ({ appointments, showAgent = true }: AppointmentsListProps) =>
  appointments.length === 0 ? (
    <p class="empty">No upcoming appointments.</p>
  ) : (
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>When</th>
            {showAgent && <th>Agent</th>}
            <th>Therapy</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr>
              <td class="nowrap">{formatDateTime(appt.starts_at)}</td>
              {showAgent && (
                <td>
                  <a href={`/agents/${appt.agent_id}`}>{appt.agent_name}</a>
                </td>
              )}
              <td>{appt.therapy_name ?? '—'}</td>
              <td>{appt.notes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
