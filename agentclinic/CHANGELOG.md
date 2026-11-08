# Changelog

## 2026-11-08

- **MVP complete.**
- Added therapies: a therapies page, and each diagnosed ailment now shows its therapy.
- Added appointments: an upcoming list and a booking form that rejects past times, double bookings and unknown agents or therapies.
- Added a staff dashboard with key numbers, agents in treatment and the next appointments.
- Existing databases are upgraded automatically; sample appointments are created relative to today.
- Fixed the appointments page overflowing on phones.
- Added agents and ailments backed by SQLite (`node:sqlite`) with seed data.
- New pages: agents list, agent detail with ailments, and ailments list with affected-agent counts.
- Applied the orange and black brand colors, with status and severity badges.
- Moved all component props into named TypeScript types.
- Server now runs from the project folder wherever it is started; added run instructions to the README.
- Added Vitest test suite for the home page, layout and static files (`npm test`).
- Made the web UI responsive (mobile-first layout, header adapts from phone to desktop).
- Added a `changelog` agent skill to keep this file up to date.
- Marked Phase 1 (Hello Hono) complete in the roadmap.
- Implemented Phase 1: Hono server on port 3000, shared layout (header, main, footer), stylesheet and home page.
- Added the Phase 1 feature spec: plan, requirements and validation.
- Added the project constitution: mission, tech stack and roadmap.
- Started AgentClinic from the course scaffold.
