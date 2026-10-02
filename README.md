# medynium-ui

Next.js workstation for Medynium, a governed Patient 360 and clinical agent. Synthetic data only; decision support, not diagnosis.

Sibling repo: `medynium-apis` (FastAPI). The UI talks only to that API.

## Quick start

Requirements: Node 22 (`.nvmrc`), npm.

```bash
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
npm run dev                    # http://localhost:3000
```

The home page shows API status. Start the backend in the other repo first (`poetry run poe dev`), or it reports "not reachable".

## How it talks to the API

The browser calls same-origin `/api/*`. `next.config.ts` proxies that to `BACKEND_URL`, so the session cookie is first-party and no CORS or third-party-cookie setup is needed. Use `apiFetch` from `src/lib/api/client.ts`; it turns the API's `{error, message}` contract into an `ApiError`.

Types come from the backend's OpenAPI file:

```bash
npm run api:types              # reads ../medynium-apis/docs/api/openapi.json
```

Run it after the backend's `poetry run poe openapi` whenever routes or schemas change, and commit `src/lib/api/schema.d.ts`.

## Daily commands

| Command              | What it does                                                    |
| -------------------- | --------------------------------------------------------------- |
| `npm run dev`        | Dev server (Turbopack)                                          |
| `npm run check`      | ESLint, Prettier check, `tsc`, Vitest. Run before every commit. |
| `npm run format`     | Prettier (with Tailwind class sorting)                          |
| `npm run test:watch` | Vitest in watch mode                                            |
| `npm run build`      | Production build                                                |

Husky runs lint-staged (ESLint and Prettier on staged files) on every commit.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (add components with `npx shadcn@latest add <name>`), TanStack Query, Zod, Vitest with Testing Library.

## Deploy (Vercel)

1. Import the GitHub repo in Vercel (framework is detected as Next.js).
2. Set `BACKEND_URL` to the deployed API (see `.env.example`) and optionally `NEXT_PUBLIC_APP_NAME`.
3. Add the Vercel URL to `CORS_ORIGINS` on the backend only if you ever call the API from the browser directly; the proxy does not need it.

The full list of external accounts, keys and decisions is in `medynium-apis/docs/external-dependencies.md`.

## Notes

- `medynium-prototype.html` (in the project folder) is a behaviour reference, not the target look.
- A banner stating that data is synthetic is rendered in the root layout and must stay on every screen that shows patient data.
