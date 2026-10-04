---
name: new-page-feature
description: Scaffold or extend a page in medynium-ui as a self-contained folder. Use when asked to build, add or fill in a screen, route or page-level feature.
---

1. Read `AGENTS.md` (Modularization) and the page's requirements in the SRS (`../medynium-apis/docs/requirements/Medynium_SRS.md`) and plan. Check `node_modules/next/dist/docs/` for the Next.js 16 API you are about to use.
2. Find the endpoints in `src/lib/api/schema.d.ts`. If one is missing, stop and ask for an API change; never hand-write API types.
3. Create the folder under `src/app/(workstation)/<route>/`:
   - `page.tsx`: server component, thin, composes components.
   - `components/`: one component per file, at most 200 lines. Add `"use client"` only where state or effects need it.
   - `hooks/`: React Query hooks calling `@/lib/api/client`. Components never fetch.
   - `lib/` and `types.ts` only if needed.
   - `README.md` card: purpose, endpoints used, requirement IDs, states handled.
4. Every data component handles loading, empty, error-with-retry and agent-unavailable states. A denied patient renders the same not-found state as a missing one. Show the synthetic-data banner where patient data appears.
5. Use shadcn primitives from `src/components/ui`. Promote a component to `src/components/shared` only when a second page needs it.
6. Add a test next to the code for the main states, then run `npm run check`.
