# Patient: Safety review

**Purpose:** the manual "Run safety review" (HJ-1, HJ-5). Streams the real steps, then shows tagged statements with evidence buttons, or the honest gap. Each conclusion has **Add to findings**; the Findings card then records the clinician's decision (acknowledge, follow up with a date, escalate to a colleague who has the patient, or dismiss with a reason). Also lists the evidence the doctor pinned.

**Endpoints:** `POST /patients/{id}/safety-review` (server-sent events), `GET/DELETE /patients/{id}/pins`, `GET/POST /patients/{id}/findings`, `GET /patients/{id}/colleagues`, `PATCH /findings/{id}`, `GET /evidence/{answer_id}` (through the Why? drawer).

**Findings:** only a person raises or changes one; the assistant cannot. The server requires a reason to dismiss, a date to follow up and a colleague to escalate, and writes an audit row for each change. Needs the `FINDING` table (`db.py apply 05`, `06`, `60`).

**Requirement IDs:** FR-06 to FR-09, FR-20, NFR-10, AI-05, AI-07.

**Manual parity:** the assistant's `run_safety_review` action lands here (`?tab=safety`) and calls the same endpoint. With the assistant collapsed or failing this button gives the same evidence and the same drawer.

**States handled:** idle, running (live steps in a polite live region), done (answer announced once), honest gap (fixed wording, what was checked, what was not, snapshot date), agent unavailable or timeout (panel-style banner with retry; the rest of the record keeps working), rate limited (countdown), error with message. Not found (denied or missing) is handled by the workspace gate and by the same wording if it appears during a run.

**Keyboard:** Run is a button; steps expand with `<details>`; every evidence reference is a button; pin removal is a named icon button.

**Session memory:** the last run is held in the query cache so switching tabs does not lose it. It is not persisted; the stored evidence behind it is the record.
