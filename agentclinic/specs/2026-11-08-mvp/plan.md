# MVP Plan

## Group 1 – Database

1. Add `therapies (id, name, description, duration_minutes)`.
2. Add `therapy_id` (nullable) to `agent_ailments`, with an in-place upgrade for existing databases.
3. Add `appointments (id, agent_id, therapy_id, starts_at, notes)` with a unique `(agent_id, starts_at)`.
4. Seed therapies, assign therapies to diagnosed ailments, and seed appointments relative to today.
5. Queries: `listTherapies`, `listUpcomingAppointments`, `createAppointment`, `getDashboardStats`, `listAgentsInTreatment`.

## Group 2 – Therapies

6. `TherapiesList` component and `GET /therapies`.
7. Show each ailment's therapy on the agent detail page, plus the agent's upcoming appointments.

## Group 3 – Appointments

8. `validateAppointment(db, input, now)` returns a list of error messages.
9. `AppointmentForm` and `AppointmentsList` components.
10. `GET /appointments` – form and upcoming list.
11. `POST /appointments` – validate; 400 with errors, or 303 redirect on success.

## Group 4 – Dashboard

12. `GET /dashboard` – stat cards (agents, in treatment, diagnosed ailments, upcoming appointments), agents in treatment, next 5 appointments.
13. Home page links to the dashboard.

## Group 5 – Navigation and style

14. Header links to all pages.
15. Styles for forms, errors, stat cards – orange and black, responsive.

## Group 6 – Tests and validation

16. Tests for every new route, each booking rule, and the database upgrade.
17. Run every check in `validation.md`; update `CHANGELOG.md`.
