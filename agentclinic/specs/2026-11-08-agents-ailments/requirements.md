# Phase 2a Requirements – Agents & Ailments

The first slice of roadmap Phase 2.

## Scope

- SQLite database with `agents`, `ailments` and `agent_ailments` tables.
- Seed data so the clinic is never empty.
- Read-only pages:
  - `/agents` – list of agents.
  - `/agents/:id` – one agent with their ailments.
  - `/ailments` – list of ailments with how many agents have each.
- Navigation links in the header.
- Brand colors: orange and black.

## Out of scope

- Adding or editing agents and ailments (forms).
- Therapies, appointments, dashboard (later in Phase 2 / MVP).

## Decisions

- **Database:** Node's built-in `node:sqlite` (`DatabaseSync`), no extra package.
- **Database file:** `agentclinic.db` in the project root (ignored by git). Tests use an in-memory database.
- **App factory:** `createApp(db)` builds the Hono app around a database, so tests can pass their own.
- **Components:** each component's props are defined as a named TypeScript `type`, not inline.
- **Brand:** primary orange `#f97316`, black `#111111` for header/footer, white surfaces.

## Context

- Follows `../mission.md` (serious, professional clinic system) and `../tech-stack.md` (Hono, SQLite, Vitest, responsive).
- Reuses the layout from Phase 1.
