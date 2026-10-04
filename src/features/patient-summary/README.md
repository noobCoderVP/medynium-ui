# features/patient-summary

**Purpose:** the written summary of a patient, in markdown: stored once, shown with when it was written and by whom, and rewritten only when a person presses Refresh. It is the left third of the Timeline (a rail that scrolls inside itself, so a long timeline never pushes it away) and the clinical summary block on the Overview.

**Endpoints:** `GET /patients/{id}/summary`, `POST /patients/{id}/summary/refresh` (about fifteen seconds; the screen shows progress).

**Behaviour:** the first time anyone opens a patient with no stored summary, one is written automatically (once per screen). After that it only changes on Refresh. A "the record has changed since" note appears when the app has recorded a change after it was written. If the language model is unavailable a rule-made summary of the same facts is stored and labelled "made by rules".

**Rules it carries:** every number in the text was checked against the record on the server; it is decision support only and says so. Markdown is rendered by `components/shared/markdown.tsx`, which builds elements and never HTML.

**Public surface (`index.ts`):** `PatientSummaryPanel`.
