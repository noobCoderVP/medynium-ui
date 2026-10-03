# Patient: Overview

**Purpose:** "Catch me up on this patient." Diagnoses, current medications, latest labs, recent events and utilisation, each value with its date and source table.

**Endpoints:** `GET /patients/{id}` (shared with the workspace header through the same query key).

**Requirement IDs:** FR-03, FR-04, FR-05, FR-17, NFR-10.

**What it shows:** the in-corpus indicator on each medicine ("label indexed" or "label not indexed") so a gap is visible before a safety review; a lab value links to its trend (`?tab=labs&lab=<code>`); card headers link to the full tab.

**States handled:** loading skeleton matching the 2x2 card layout, error with retry, rate limited. Not found is handled one level up by the workspace gate (same state for denied and missing). No agent call, so no agent-unavailable state.

**Keyboard:** every drill-down is a link.
