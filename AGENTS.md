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
- UI primitives from shadcn/ui under `src/components/ui`; feature components beside their route or in `src/components`.
- Tests next to the code (`*.test.ts(x)`), run with Vitest.
