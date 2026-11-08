# MVP Validation

Ready to merge to `main` when:

1. `npm run typecheck` exits with code 0.
2. `npm test` passes, including tests for therapies, appointments, booking rules and the dashboard.
3. `npm run dev` upgrades an existing `agentclinic.db` without losing data.
4. `/therapies` lists all therapies; the agent page shows each ailment's therapy.
5. Booking in the browser: a valid appointment appears on `/appointments` and on `/dashboard`.
6. Booking errors are shown for: missing agent, missing date, past date, and a double booking.
7. `/dashboard` shows the stat cards, agents in treatment, and the next appointments.
8. Every page works at 375px wide with no horizontal page scroll.
