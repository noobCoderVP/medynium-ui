# Patient: Claims

**Purpose:** utilisation counts and billing. Each claim shows the encounter it belongs to; billed and approved totals are INR.

**Endpoints:** `GET /patients/{id}/claims`.

**Requirement IDs:** FR-04, FR-17, NFR-10.

**URL state:** `?tab=claims&claim=CLM-1024` marks the claim a timeline event opened.

**Correctness:** totals come from the API, which computes them from the claim transactions; the UI formats only. Ground-truth parity is asserted in `medynium-apis` tests.

**States handled:** loading skeleton, empty ("No claims on record"), error with retry, rate limited.

**Keyboard:** sortable column headers are buttons; the highlighted row is marked `aria-current`.
