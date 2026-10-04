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

**Needs attention and what changed:** `components/recent-changes.tsx` sits under the header and lists labs outside their reference range (Requires review) and the latest medicine, lab and visit events from the overview already loaded (no extra call), each as a `ChangeChip` (icon and word, never colour alone) linking to its record, plus a Review safety link. Hidden when there are none.

**Tabs added in the production-readiness work:** Reports (upload, review, approve), Similar patients. See `reports/README.md` and `similar/README.md`. The Medications tab has an Add medicine dialog (doctors).
