import type { AilmentWithCount } from '../db/types'
import { SeverityBadge } from './Badges'

export type AilmentsListProps = {
  ailments: AilmentWithCount[]
}

export const AilmentsList = ({ ailments }: AilmentsListProps) => (
  <ul class="card-list">
    {ailments.map((ailment) => (
      <li class="card">
        <div class="card-title">
          <strong>{ailment.name}</strong> <SeverityBadge severity={ailment.severity} />
        </div>
        <p>{ailment.description}</p>
        <small>
          {ailment.agent_count} {ailment.agent_count === 1 ? 'agent' : 'agents'} affected
        </small>
      </li>
    ))}
  </ul>
)
