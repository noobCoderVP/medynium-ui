# Patient workspace

**Purpose:** everything about one patient, in one place. A header (who, as-of date, saved views), seven sections chosen by `?tab=`, and the gate that decides what to show.

**Endpoints:** `GET /patients/{id}` for the header (shared with the Overview tab by query key), `GET/POST /views` and `/views/preview` for saved views. Each tab folder lists its own endpoints:

| Tab (`?tab=`)        | Folder         | Context card                    |
| -------------------- | -------------- | ------------------------------- |
| `overview` (default) | `overview/`    | [README](overview/README.md)    |
| `timeline`           | `timeline/`    | [README](timeline/README.md)    |
| `medications`        | `medications/` | [README](medications/README.md) |
| `labs`               | `labs/`        | [README](labs/README.md)        |
| `claims`             | `claims/`      | [README](claims/README.md)      |
| `notes`              | `notes/`       | [README](notes/README.md)       |
| `safety`             | `safety/`      | [README](safety/README.md)      |

**Requirement IDs:** FR-03 to FR-09, FR-16, FR-20, FR-22, SEC-05, NFR-10.

**The gate (`components/patient-workspace.tsx`):** loads the patient first. A denied patient and a missing one both fail with the same 404 and both render the same "We couldn't find that patient." state, with no header, no tabs and no tab content, so nothing hints that the patient exists (SEC-05, UX rule 8). Tab content only renders once the patient has loaded, so a tab never shows a second, different error for the same patient.

**URL state:** `?tab=` plus each tab's own params (`from`, `to`, `types`, `lab`, `note`, `claim`, `status`). The Why? drawer adds `why`, `stmt`, `ref` anywhere. Saved views store the tab and its params, never clinical data.

**Saved views:** two steps (preview, then "Approve and save"). A preview writes nothing and expires after ten minutes (FR-22).

**Tab folders are self-contained:** each has its own `components/`, `hooks/` and README, and never imports a sibling (enforced by ESLint). Shared pieces live in `src/components/shared` and `src/features`.

**States handled:** loading skeleton, not found, error with retry, rate limited. Agent-unavailable appears only on the Safety tab and in the assistant panel, so the record stays usable.

**Keyboard:** the tab bar is a `<nav>` of links with `aria-current="page"`; every tab control is native or a named button.

**Workspace shell:** `components/patient-workspace.tsx` renders one sticky block (compact `patient-header.tsx` plus `tab-bar.tsx`); the header collapses to an identity line on scroll. Attention is a single clickable chip (`attention-chip.tsx`) that lists flagged labs (recorded values only, no model) and links to the safety review. Five primary tabs plus "More" (Claims, Notes, Reports, Similar patients). The content region is `flex-1 min-h-0`, so pages can fill the viewport. Surface tokens: background (shell), surface (white workspace), surface-2 (tinted secondary), card.

**Tabs added in the production-readiness work:** Reports (upload, review, approve), Similar patients. See `reports/README.md` and `similar/README.md`. The Medications tab has an Add medicine dialog (doctors).

**Polish (phase 4):** hover and focus states on every link, row and card; `Alt+1..9` opens a section, `/` focuses the page search, Up and Down move through the notes list; shaped loading skeletons (`components/shared/skeletons.tsx`) for the workspace, tables and cards; Labs shows the trend beside the table on wide screens, with a slope marker per row; "Explain these results" and "Explain trend" (`AskButton` from the agent panel) open the assistant with a ready question and render nothing when it is unavailable, so every page works without them. Record links come from `src/lib/event-types.ts`.
