# Patient: Notes

**Purpose:** clinical documents for the patient: a list and a reader.

**Endpoints:** `GET /patients/{id}/notes`, `GET /patients/{id}/notes/{note_id}`.

**Requirement IDs:** FR-04, SEC-12, AI-06.

**URL state:** `?tab=notes&note=NOTE-12` (the timeline links here).

**Safety:** note text is rendered as plain text with preserved line breaks, never as markup or links. A note that contains instruction-like text (the S5 test note) is only ever displayed; the backend treats it as data for the assistant too.

**States handled:** loading skeletons (list and reader), empty list, "choose a note" prompt, error with retry for each, rate limited.

**Keyboard:** each note is a button; the reader is a polite live region so a selection is announced.
