# features/evidence

**Purpose:** prove an answer. The tagged answer view and the Why? drawer that lists the patient records, SQL and sources behind each statement.

**Endpoints:** `GET /evidence/{answer_id}`, `GET/POST /patients/{id}/pins` (pin an item).

**Requirement IDs:** FR-08, FR-09, NFR-05, NFR-10, AI-05, AI-07, AI-08.

**Public surface (`index.ts`):** `AnswerView`, `EvidenceDrawer`, `RefButton`.

**In words, with proof (phase C):** under each statement the records and label sections it rests on are shown as text ("eGFR 42 mL/min on 14 Sep 2026", "Lisinopril label · Warnings and precautions"), each with a link that opens the real source (the lab on its trend, the note, the label with its citation) and a Details button for the panel. Ids such as P1 and S2 stay inside the panel and are the fallback only if the evidence cannot be read. The gap block reads "What I checked / What I could not check".

**URL contract:** `?why=<answer id>&stmt=<statement id>&ref=<evidence id>`. `RefButton` pushes it, the drawer reads it, closing removes it. Pages and the agent panel never pass evidence through props.

**Rules it carries:**

- Three tags, never mixed: `Patient fact`, `Retrieved source`, `AI synthesis`. Tag is text plus icon shape. Synthesis always shows the hedge from `copy.ts`.
- A safety answer with no statements is rendered as the honest gap (what was checked, what was not, snapshot date), never as "no risk".
- Not hover-only: every reference is a button. Focus moves into the drawer on open and back to the trigger on close (Base UI dialog), `Esc` closes.
- Someone else's answer and a missing one both show the same not-found state.

**States handled:** loading skeleton, error with retry, not found, empty evidence, agent-unavailable never applies here (reads are plain SQL).

**Imports:** `@/lib/*`, `@/components/*`. Imported by pages and `features/agent-panel` only through this `index.ts`.
