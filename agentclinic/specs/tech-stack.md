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

## Tooling

- `npm` for dependencies and scripts.
- `tsc` for type checking and builds.
- `tsx` for running TypeScript in development.

## Why this stack

- Popular and well documented (meets engineering's reliability request).
- Few moving parts, so each feature is small and easy to validate.
