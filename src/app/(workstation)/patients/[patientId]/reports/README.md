# Patient: Reports

**Purpose:** upload a lab report or prescription (PDF, PNG, JPEG), see what was read from it with the exact words and page, and approve the rows that are right. Reading is staged: nothing is written to the record until a doctor approves, and approved rows carry the report as their source.

**Endpoints:** `GET/POST /patients/{id}/reports`, `GET /patients/{id}/reports/{report_id}`, `POST /patients/{id}/reports/rows/{row_id}/{accept|reject}`, `POST /patients/{id}/reports/{report_id}/approve|reject`.

**Requirement IDs:** FR-04, FR-05, SEC-05, NFR-10.

**States handled:** loading skeleton, empty, error with retry; a report being read refreshes itself every 3 s; a failed read shows the reason; a name mismatch needs an explicit confirmation before approval. Doctors approve; the server returns 403 to others and the buttons then show the error.

**Notes:** the upload sends the file as raw bytes with `X-Filename` (percent-encoded) and its content type.
