# Phase 1 Requirements – Hello Hono

## Scope

- A running Hono web server written in TypeScript.
- A shared layout (header, main, footer) and a base stylesheet.
- A minimal AgentClinic home page.

## Out of scope

- Database (SQLite comes in Phase 2).
- Agents, ailments, therapies, appointments, dashboard.
- Tests beyond the checks in `validation.md`.

## Decisions

- **Framework:** Hono with server-side JSX (see `../tech-stack.md`).
- **Port:** 3000.
- **Language:** English, left-to-right.
- **Tone:** serious and professional, matching `../mission.md`.
- **Dependencies:** pinned to exact versions.

## Context

- This is the first phase on `../roadmap.md`.
- Every later page will reuse the layout built here, so it must be simple and easy to extend.
