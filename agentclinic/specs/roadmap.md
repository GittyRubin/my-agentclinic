# Roadmap

High-level implementation order, in very small phases. Each phase gets its own feature spec before it is built.

## Phase 1 – Hello Hono ✅ Complete

- Hono server running with TypeScript.
- Shared layout: header, navigation, footer, base CSS.
- Home page that says what AgentClinic is.
- Vitest tests and responsive design (added during replanning).

## Phase 2 – Agents, ailments, therapies, appointments and dashboard ✅ Complete (MVP)

Combined from the earlier phases 2–5 so the core clinic workflow ships together.

- ✅ SQLite database set up, with seed data.
- ✅ Agents: list and view agents.
- ✅ Ailments: list ailments and link them to agents.
- ✅ Therapies: list therapies and assign a therapy to an agent's ailment.
- ✅ Appointments: book an appointment for an agent and list upcoming appointments.
- ✅ Dashboard: one overview page for staff – agents, open ailments and upcoming appointments.
- ✅ Every page is responsive and covered by Vitest tests.

## Next (after the MVP)

- Agent status changes (in treatment → recovered).
- Edit and cancel appointments.
- Add agents, ailments and therapies from the UI.
