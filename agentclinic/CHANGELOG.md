# Changelog

## 2026-11-08

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
