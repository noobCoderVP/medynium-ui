# Patient: Medications

**Purpose:** current and past medicines with dose, start, last change note, Indian brand names and whether the drug's label is in the knowledge corpus.

**Endpoints:** `GET /patients/{id}/medications?status=active|all`.

**Requirement IDs:** FR-03, FR-05, FR-12, NFR-10.

**URL state:** `?tab=medications&status=all`.

**States handled:** loading skeleton, empty (explains), error with retry, rate limited. Not found is handled by the workspace gate.

**Keyboard:** the status filter is a native select; table headers sort with buttons.

**Why the "label" column exists:** a medicine whose label is not indexed produces an honest gap in the safety review. Showing that here means the doctor is not surprised by it.
