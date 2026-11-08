# MVP Requirements – Therapies, Appointments, Dashboard

Completes roadmap Phase 2 and delivers the AgentClinic MVP.

## Scope

- **Therapies:** a `therapies` table, a `/therapies` page, and a therapy assigned to each diagnosed ailment (shown on the agent page).
- **Appointments:** an `appointments` table, a `/appointments` page that lists upcoming appointments, and a booking form.
- **Dashboard:** a `/dashboard` page for staff with key numbers, agents in treatment, and the next appointments.
- Navigation: Home, Dashboard, Agents, Ailments, Therapies, Appointments.

## Booking rules

- Required: agent and date/time. Therapy and notes are optional.
- The date/time must be in the future.
- An agent cannot have two appointments at the same date/time.
- The agent and therapy must exist.
- On error the form is shown again with a clear message and the entered values (HTTP 400).
- On success the user is redirected to `/appointments` (HTTP 303).

## Out of scope

- Editing or cancelling appointments.
- Adding agents, ailments or therapies from the UI.
- Authentication.

## Decisions

- Date/time is stored as local `YYYY-MM-DDTHH:MM` text (the value of an HTML `datetime-local` input), so text comparison sorts correctly.
- Validation lives in a pure function `validateAppointment` so it can be tested without HTTP.
- Existing databases are upgraded in place: new tables are created and the `therapy_id` column is added if missing; each table is seeded only when empty.
- Seeded appointments are relative to the current date, so the dashboard always has upcoming data.

## Clarifications found while building the MVP

1. **Time zone.** Times are the clinic's local time; there is no time zone support. An appointment "in the future" means later than the server's current local minute.
2. **Agent status is not automatic.** Booking an appointment does not change an agent's status to `in-treatment`, and finishing therapy does not mark them `recovered`. Status changes are out of scope for the MVP and should get their own feature spec.
3. **Responsive layouts with tables.** Grid or flex columns that contain a table must allow shrinking (`min-width: 0`), otherwise the table widens the whole page on phones. Found during validation on `/appointments` and fixed.

## Context

- See `../mission.md`, `../tech-stack.md` and the earlier feature specs (`../2026-11-08-hello-hono/`, `../2026-11-08-agents-ailments/`).
