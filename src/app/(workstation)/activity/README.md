# Activity log

**Purpose:** "What did the assistant do on my behalf?" The signed-in user's own audit entries: when, what action, which route and model, the question, the patient, the evidence, and the outcome. Denied and refused attempts are listed too.

**Endpoints:** `GET /audit?action=&outcome=&from=&to=&limit=&offset=`.

**Requirement IDs:** FR-10, FR-21, AI-12, SEC-09.

**URL state:** `?action=ASK&outcome=DENIED&from=&to=&offset=`.

**Steps equal the stream:** the expander shows the stored steps for the run, which the API guarantees match what the panel streamed (tested in `medynium-apis`).

**Outcomes** are shown as text with a tone (OK, Refused, Denied, Action not allowed, Error), never colour alone.

**States handled:** loading skeleton, empty (says how to widen the filters), error with retry, rate limited, previous page kept while the next loads.

**Keyboard:** native filter controls; sortable headers are buttons; the steps expander is a native `<details>`; an answer id is a button that opens the Why? drawer.

**AI performance card (phase G):** a summary of the assistant's own activity over the last 7 days from `GET /audit/summary`: questions asked, typical and slowest waits, changes approved or discarded, routes, planner and answer models, tools chosen and the slowest steps. It is a convenience: if it cannot load, the log below is unaffected.
