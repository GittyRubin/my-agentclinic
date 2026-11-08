# Phase 1 Validation – Hello Hono

The phase is done and can be merged to `main` when all of these pass:

1. `npm install` completes without errors.
2. `npm run typecheck` exits with code 0.
3. `npm run dev` starts the server on port 3000 without errors.
4. `GET http://localhost:3000/` returns HTML that contains the `<h1>` "AgentClinic", a header, and a footer.
5. `GET http://localhost:3000/static/style.css` returns the stylesheet.
6. Opening `http://localhost:3000` in a browser shows a clean, styled page.
