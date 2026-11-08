import type { Agent, AgentAilment, Appointment } from '../db/types'
import { SeverityBadge, StatusBadge } from './Badges'
import { AppointmentsList } from './AppointmentsList'

export type AgentDetailProps = {
  agent: Agent
  ailments: AgentAilment[]
  appointments: Appointment[]
}

export const AgentDetail = ({ agent, ailments, appointments }: AgentDetailProps) => (
  <article>
    <p>
      <a href="/agents">&larr; All agents</a>
    </p>
    <h1>{agent.name}</h1>
    <dl class="details">
      <dt>Model</dt>
      <dd>{agent.model}</dd>
      <dt>Status</dt>
      <dd>
        <StatusBadge status={agent.status} />
      </dd>
      <dt>Joined</dt>
      <dd>{agent.joined_on}</dd>
    </dl>

    <h2>Ailments</h2>
    {ailments.length === 0 ? (
      <p class="empty">No ailments recorded.</p>
    ) : (
      <ul class="card-list">
        {ailments.map((ailment) => (
          <li class="card">
            <div class="card-title">
              <strong>{ailment.name}</strong> <SeverityBadge severity={ailment.severity} />
            </div>
            <p>{ailment.description}</p>
            <p class="therapy">
              Therapy: <strong>{ailment.therapy_name ?? 'Not assigned yet'}</strong>
            </p>
            <small>Diagnosed {ailment.diagnosed_on}</small>
          </li>
        ))}
      </ul>
    )}

    <h2>Upcoming appointments</h2>
    <AppointmentsList appointments={appointments} showAgent={false} />
  </article>
)
