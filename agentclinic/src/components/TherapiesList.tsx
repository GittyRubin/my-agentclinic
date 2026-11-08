import type { Therapy } from '../db/types'

export type TherapiesListProps = {
  therapies: Therapy[]
}

export const TherapiesList = ({ therapies }: TherapiesListProps) => (
  <ul class="card-list">
    {therapies.map((therapy) => (
      <li class="card">
        <div class="card-title">
          <strong>{therapy.name}</strong>
        </div>
        <p>{therapy.description}</p>
        <small>{therapy.duration_minutes} minutes</small>
      </li>
    ))}
  </ul>
)
