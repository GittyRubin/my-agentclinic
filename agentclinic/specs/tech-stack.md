# Tech Stack

## Runtime and language

- **Node.js** (v18+)
- **TypeScript** on the server side, strict mode

## Web framework

- **Hono** – a small, fast, modern web framework with first-class TypeScript support.
- Pages are rendered on the server with **Hono JSX** (no separate frontend build).

## Database

- **SQLite** – a single-file database, no server to install, ideal for a small reliable app and for demos.

## Styling

- Plain CSS served as a static file, with a shared layout (header, navigation, footer).
- Responsive design that works in modern browsers.

## Styling: responsive design

- The web UI follows responsive design: mobile-first CSS, a `viewport` meta tag, fluid widths, and media queries for wider screens.
- Every page must be usable on a phone (≈375px), a tablet, and a desktop.

## Testing

- **Vitest** for automated tests, in the `tests/` directory.
- Route tests call the Hono app directly with `app.request()` – no running server needed.
- `npm test` runs the suite once; `npm run test:watch` re-runs on change.
- Every feature's `validation.md` must include passing `npm test`.

## Tooling

- `npm` for dependencies and scripts.
- `tsc` for type checking and builds (`npm run typecheck`).
- `tsx` for running TypeScript in development.
- `vitest` for tests (`npm test`).

## Why this stack

- Popular and well documented (meets engineering's reliability request).
- Few moving parts, so each feature is small and easy to validate.
