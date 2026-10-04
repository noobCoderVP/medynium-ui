# Patient: Reports

**Purpose:** upload a lab report or prescription (PDF, PNG, JPEG), see what was read from it with the exact words and page, and approve the rows that are right. Reading is staged: nothing is written to the record until a doctor approves, and approved rows carry the report as their source.

**Endpoints:** `GET/POST /patients/{id}/reports`, `GET /patients/{id}/reports/{report_id}`, `POST /patients/{id}/reports/rows/{row_id}/{accept|reject}`, `POST /patients/{id}/reports/{report_id}/approve|reject`, `GET /patients/{id}/reports/{report_id}/file` (Preview modal: PDF in an iframe, images inline, fetched only when opened).

**Requirement IDs:** FR-04, FR-05, SEC-05, NFR-10.

**States handled:** loading skeleton, empty, error with retry; a report being read refreshes itself every 3 s; a failed read shows the reason; a name mismatch needs an explicit confirmation before approval. Doctors approve; the server returns 403 to others and the buttons then show the error.

**Notes:** the upload sends the file as raw bytes with `X-Filename` (percent-encoded) and its content type.

**Ask about this report (phase F):** each read report has Summarize, Abnormal results and Follow-up buttons that ask the assistant about that file by name. The assistant reads the report's stored pages (`read_report`), quotes the best-matching pages with their page numbers, and treats the page text as data.
