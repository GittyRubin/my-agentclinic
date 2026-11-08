# AgentClinic

A clinic management system for AI agents, built with spec-driven development.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest suite
npm run typecheck  # TypeScript check
```

The SQLite database `agentclinic.db` is created and seeded on first start.

## Specs

- `specs/mission.md`, `specs/tech-stack.md`, `specs/roadmap.md` – the project constitution.
- `specs/YYYY-MM-DD-feature/` – one folder per feature: `plan.md`, `requirements.md`, `validation.md`.

## Input from stakeholders

- Mary in engineering wants a reliable site with a popular stack based on TypeScript, giving agents and staff a dashboard for easy access.
- Susan in product has a set of features about agents and their ailments, therapies, and booking appointments.
- Steve in marketing wants an attractive site that works well with a modern browser.
