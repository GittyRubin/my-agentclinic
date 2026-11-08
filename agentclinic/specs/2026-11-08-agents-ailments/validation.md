# Phase 2a Validation – Agents & Ailments

Ready to merge to `main` when:

1. `npm run typecheck` exits with code 0.
2. `npm test` passes, including new tests for `/agents`, `/agents/:id` and `/ailments`.
3. `npm run dev` creates and seeds `agentclinic.db` on first start.
4. `/agents` lists all seeded agents; each links to its detail page.
5. `/agents/:id` shows the agent and their ailments; an unknown id returns 404.
6. `/ailments` lists all ailments with the number of affected agents.
7. Header and footer are black, accents are orange, and every page works at 375px wide with no horizontal page scroll.
8. `agentclinic.db` is not committed to git.
