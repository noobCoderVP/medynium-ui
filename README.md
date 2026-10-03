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

Start the backend in the other repo first (`poetry run poe dev`). Add `REFRESH_COOKIE_PATH=/api/auth` to the backend's `.env` (see its `.env.example`): the browser reaches the API under `/api`, so the refresh cookie must be scoped to that path or sessions cannot renew. Then open the app and sign in with a demo account (credentials are in `~/.medynium/demo_credentials.txt`, outside the repo).

## Screens

| Route                                      | What                                                                                   | Folder                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------- |
| `/sign-in`, `/invite/[token]`              | Sign in, accept an invite or reset link                                                | `src/app/(auth)/`                  |
| `/dashboard`                               | Worklist, what changed, utilisation, Brief me                                          | `src/app/(workstation)/dashboard/` |
| `/patients`, `/patients/[patientId]`       | Search; Overview, Timeline, Medications, Labs, Claims, Notes, Safety review (`?tab=`)  | `src/app/(workstation)/patients/`  |
| `/knowledge`                               | Drug label search with full citations                                                  | `src/app/(workstation)/knowledge/` |
| `/activity`                                | The signed-in user's audit log                                                         | `src/app/(workstation)/activity/`  |
| `/admin`, `/admin/users`, `/admin/invites` | Health, users and entitlements, invites (admin doctors)                                | `src/app/(workstation)/admin/`     |
| `/dev/components`                          | Component gallery in every state, light and dark (development only; 404 in production) | `src/app/dev/`                     |

Cross-page features live in `src/features/`: `session`, `evidence` (answer view and the Why? drawer) and `agent-panel` (assistant and command bar). Each folder has a README context card; start there when analysing a folder.

The auth gate is `src/proxy.ts` (Next 16's name for middleware) plus the client's refresh-once-then-sign-in handling in `src/lib/api/client.ts`.

## How it talks to the API

The browser calls same-origin `/api/*`. `next.config.ts` proxies that to `BACKEND_URL`, so the session cookie is first-party and no CORS or third-party-cookie setup is needed. All calls go through `src/lib/api/client.ts` (refresh once on 401, `{error, message}` into `ApiError`, the `X-Medynium-Client` header on writes), the typed list in `src/lib/api/endpoints.ts`, and `src/lib/api/sse.ts` for the assistant and safety-review streams. Only hooks call them; components never do (enforced by ESLint).

Types come from the backend's OpenAPI file:

```bash
npm run api:types              # reads ../medynium-apis/docs/api/openapi.json
```

Run it after the backend's `poetry run poe openapi` whenever routes or schemas change, and commit `src/lib/api/schema.d.ts`.

## Daily commands

| Command              | What it does                                                                    |
| -------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`        | Dev server (Turbopack)                                                          |
| `npm run check`      | ESLint, Prettier check, `tsc`, Vitest, contrast check. Run before every commit. |
| `npm run contrast`   | WCAG contrast of every colour-token pair, both themes                           |
| `npm run format`     | Prettier (with Tailwind class sorting)                                          |
| `npm run test:watch` | Vitest in watch mode                                                            |
| `npm run build`      | Production build                                                                |

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
- The synthetic-data banner is rendered by the workstation shell and so shows on every screen with patient data.
- Design tokens live in `src/app/globals.css`; the design direction, component specs and accessibility pass are in `docs/design/`, and manual parity and test evidence in `docs/quality/`.
