# Pending work

**Purpose:** one list of what is waiting on the signed-in clinician across their own patients (escalated or open findings, follow-ups, reports to review, abnormal labs, recent emergency visits), most urgent first. Each row opens the patient on the tab where it is handled.

**Endpoints:** `GET /pending?kind=&limit=&offset=`, `GET /pending/summary`, `POST /patients/{id}/labs/{lab_id}/review` (doctors; "Mark reviewed" on abnormal labs).

**Requirement IDs:** FR-02, FR-16, NFR-10.

**States handled:** loading skeleton, empty ("Nothing is waiting on you."), error with retry, rate limited.

**Layout:** summary tiles (open, overdue, as-of), a filter with one button per kind and its count, then rows: patient, kind chip (icon and word), title, detail, due and raised dates, and one action button that opens the tab where the item is handled (`lib/kinds.ts` holds the kind-to-tab map). Overdue rows get a red edge and an Overdue chip.

**Notes:** the API scopes items to the caller's entitled patients; this page never filters by patient itself.
