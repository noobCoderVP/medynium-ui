<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md: medynium-ui

Working rules for every CoCo or Claude Code session in this repo. The BRD, SRS and implementation plan explain the why.

## What this is

Next.js workstation for Medynium: dashboard, patient workspace (Overview, Timeline, Medications, Labs, Claims), Knowledge search, Why? evidence panel, Activity log, Admin, and a collapsible agent panel. The backend is the sibling repo `medynium-apis`; this app never talks to Snowflake.

## Commands

- `npm run dev`, `npm run check` (run before every commit), `npm run api:types` (regenerate API types from `../medynium-apis/docs/api/openapi.json`)

## Rules that must not be broken

1. **API only through `src/lib/api/client.ts`**, same-origin `/api/*`. No direct calls to the backend host, no Snowflake or secrets in the browser. Only `NEXT_PUBLIC_*` variables may be read client-side.
2. **Types come from the OpenAPI file**, not hand-written. Do not edit `src/lib/api/schema.d.ts`.
3. **Synthetic-data banner on every screen that shows patient data** (SEC-08, AI-07).
4. **A denied patient looks like a missing one.** Render the same not-found state for both; never hint that a patient exists.
5. **Manual parity.** Every agent action has a manual control, and the workspace stays fully usable with the agent panel collapsed or failing (FR-16, FR-20, NFR-13).
6. **Evidence everywhere.** Each answer statement shows its tag (patient fact, retrieved source, AI synthesis) and opens the Why? panel without hover (NFR-10).
7. **Every data screen has loading, empty, error-with-retry and agent-unavailable states.**
8. **Accessibility:** keyboard reachable, readable contrast in light and dark, no hover-only content.
9. **The prototype is a behaviour reference only**, not the visual target. Wait for design direction before porting its styling.

## Conventions

- TypeScript strict, no `any`. Prettier decides formatting (Tailwind classes are sorted by its plugin).
- Server components by default; add `"use client"` only where state or effects need it.
- UI primitives from shadcn/ui under `src/components/ui`; everything else follows "Modularization" below.
- Tests next to the code (`*.test.ts(x)`), run with Vitest.
- No mock layer: build against the real API (stubs answer 501), and show the agent-unavailable or error state until a slice lands.

## Modularization (enforced by `eslint.config.mjs`)

Each page folder is self-contained so it can be analysed, tested or handed to an AI session on its own:

```text
src/app/(workstation)/patients/[patientId]/
  page.tsx        thin: reads params, composes components
  components/     used only by this page
  hooks/          page-specific React Query hooks; the only place that calls src/lib/api/client.ts
  lib/            page-specific helpers and constants
  types.ts        local view-models (API types still come from schema.d.ts)
  README.md       context card: purpose, API endpoints used, requirement IDs, states handled
src/components/ui/       shadcn primitives only
src/components/shared/   used by 2+ pages (promote on the second use, not before)
src/lib/                 api client, env, utils; no UI
```

- Never import from another route folder, by relative path or `@/app/...`. Shared code moves to `components/shared` or `lib`.
- Components do not call `fetch` or the API client. Hooks do.
- One component per file, at most 200 lines (skipping blanks and comments). Split before it grows.
- Keep each page's `README.md` card current when its endpoints, states or requirement IDs change.

## Definition of done for a slice

1. `npm run check` passes (lint, format, types, tests).
2. Loading, empty, error-with-retry and agent-unavailable states exist; the synthetic banner shows on patient data.
3. Keyboard reachable, readable in light and dark, no hover-only content.
4. `npm run api:types` was run if the API changed, and the page README card is current.

## Don't

- Don't add a dependency without asking. Don't edit `src/lib/api/schema.d.ts` or `.env` (a hook blocks both).
- Don't port prototype styling before design direction arrives.
- Don't add `"use client"` to a page or layout when a small client child component will do.

## Project skills (`.claude/skills/`)

- `new-page-feature`: scaffold a page folder with components, hooks, states, test and README card
- `slice-done`: run the done checklist and tick the implementation-plan tracker
