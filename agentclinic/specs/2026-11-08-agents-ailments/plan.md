# Phase 2a Plan – Agents & Ailments

## Group 1 – Database

1. `src/db/index.ts`: `openDb(path)` returns a `DatabaseSync` and creates the tables if missing.
2. Tables: `agents (id, name, model, status, joined_on)`, `ailments (id, name, description, severity)`, `agent_ailments (agent_id, ailment_id, diagnosed_on)`.
3. `src/db/seed.ts`: insert sample agents, ailments and links when the database is empty.
4. `src/db/types.ts`: `Agent`, `Ailment`, `AgentAilment` types.
5. `src/db/queries.ts`: `listAgents`, `getAgent`, `listAilmentsForAgent`, `listAilments`.

## Group 2 – App factory

6. `src/app.tsx` exports `createApp(db)`; `src/index.tsx` opens `agentclinic.db`, seeds it, and serves the app.
7. Add `*.db` to `.gitignore`.

## Group 3 – Pages

8. `src/components/AgentsList.tsx`, `AgentDetail.tsx`, `AilmentsList.tsx` with named props types.
9. Routes: `GET /agents`, `GET /agents/:id` (404 if not found), `GET /ailments`.
10. Header navigation: Home, Agents, Ailments.

## Group 4 – Brand and props

11. Update `static/style.css` to orange and black, keep it responsive (tables scroll or stack on phones).
12. Move every component's props to a named `type` (Layout, Main, and the new components).

## Group 5 – Tests

13. Tests use `createApp(openDb(':memory:'))` with seed data.
14. Test each new route, the 404 for a missing agent, and the navigation links.

## Group 6 – Wrap-up

15. Run every check in `validation.md`.
16. Update `CHANGELOG.md` with the changelog skill.
