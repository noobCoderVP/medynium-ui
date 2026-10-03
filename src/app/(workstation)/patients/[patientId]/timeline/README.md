# Patient: Timeline

**Purpose:** history in order. Typed events, newest first, filtered by date range and event type. Selecting an event opens the underlying record.

**Endpoints:** `GET /patients/{id}/timeline?from=&to=&types=`.

**Requirement IDs:** FR-04, FR-16, FR-20, NFR-10.

**URL state:** `?tab=timeline&from=2026-01-01&to=2026-03-01&types=LAB_PANEL,NOTE`. The assistant's `show_timeline` action only sets these params (manual parity: the same controls are on this page).

**Opening a record:** each event links to the tab for its record type (medications, labs, claims, notes), deep-linked where an id is available (`?claim=`, `?note=`). Diagnoses and visits link to the overview.

**States handled:** loading skeleton, empty (says to widen the range), error with retry, rate limited.

**Keyboard:** native date and checkbox inputs; each event has one link, named for its event.
