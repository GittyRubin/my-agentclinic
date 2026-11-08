# Phase 1 Plan – Hello Hono

## Group 1 – Package setup

1. Install `hono` and `@hono/node-server` (exact versions, no `^`).
2. Install `tsx` as a dev dependency.
3. Make sure `tsconfig.json` has `"strict": true`, Node-friendly `module`/`target`, and JSX set up for Hono (`"jsx": "react-jsx"`, `"jsxImportSource": "hono/jsx"`).

## Group 2 – Application entry point

4. Replace the `src/index.ts` placeholder with `src/index.tsx` containing a minimal Hono app.
5. Add a `GET /` route.
6. Call `serve()` to listen on port 3000.

## Group 3 – Scripts

7. Add `"dev": "tsx watch src/index.tsx"` to `package.json`.
8. Add `"typecheck": "tsc --noEmit"` to `package.json`.

## Group 4 – Home page

9. Create `src/pages/Home.tsx` as a Hono JSX component.
10. The page shows an `<h1>` "AgentClinic" and a short tagline.
11. `GET /` returns the rendered home page.

## Group 5 – Layout

12. Create `src/components/Layout.tsx` with `<html>`, `<head>`, `<body>`; it uses `<Header>`, `<Main>`, `<Footer>`.
13. Create `Header.tsx`, `Main.tsx`, `Footer.tsx` in `src/components/`, one component per file.
14. `<head>` links to `/static/style.css`.
15. Create `static/style.css` with minimal, professional base styles.
16. Serve `static/` with `serveStatic` from `@hono/node-server/serve-static`.
17. `Home.tsx` uses `<Layout>` and puts its content inside `<Main>`.

## Group 6 – Tests

18. Move the Hono app to `src/app.tsx` (exported), keep `src/index.tsx` for `serve()` only.
19. Add Vitest and an `npm test` script.
20. Write `tests/home.test.ts`: home page, layout parts, stylesheet link, static CSS, 404.

## Group 7 – Responsive design

21. Mobile-first CSS; header stacks on narrow screens, side by side from 640px.
22. Fluid main width with comfortable padding on all screen sizes.

## Group 8 – Verify

23. Run every check in `validation.md`.
