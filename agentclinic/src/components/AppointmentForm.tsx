import type { Agent, AppointmentInput, LocalDateTime, Therapy } from '../db/types'

export type AppointmentFormProps = {
  agents: Agent[]
  therapies: Therapy[]
  values: AppointmentInput
  errors: string[]
  minStartsAt: LocalDateTime
}

export const AppointmentForm = ({ agents, therapies, values, errors, minStartsAt }: AppointmentFormProps) => (
  <form method="post" action="/appointments" class="form">
    <h2>Book an appointment</h2>

    {errors.length > 0 && (
      <div class="form-errors" role="alert">
        <ul>
          {errors.map((error) => (
            <li>{error}</li>
          ))}
        </ul>
      </div>
    )}

    <label>
      Agent
      <select name="agent_id" required>
        <option value="">Choose an agent…</option>
        {agents.map((agent) => (
          <option value={String(agent.id)} selected={values.agent_id === String(agent.id)}>
            {agent.name}
          </option>
        ))}
      </select>
    </label>

    <label>
      Therapy <span class="optional">(optional)</span>
      <select name="therapy_id">
        <option value="">No therapy yet</option>
        {therapies.map((therapy) => (
          <option value={String(therapy.id)} selected={values.therapy_id === String(therapy.id)}>
            {therapy.name}
          </option>
        ))}
      </select>
    </label>

    <label>
      Date and time
      <input type="datetime-local" name="starts_at" value={values.starts_at} min={minStartsAt} required />
    </label>

    <label>
      Notes <span class="optional">(optional)</span>
      <textarea name="notes" rows={3} maxlength={500}>
        {values.notes}
      </textarea>
    </label>

    <button type="submit">Book appointment</button>
  </form>
)
