# Patient: Overview

**Purpose:** "Catch me up on this patient." Diagnoses, current medications, latest labs, recent events and utilisation, each value with its date and source table.

**Endpoints:** `GET /patients/{id}` (shared with the workspace header through the same query key).

**Requirement IDs:** FR-03, FR-04, FR-05, FR-17, NFR-10.

**What it shows:** the in-corpus indicator on each medicine ("label indexed" or "label not indexed") so a gap is visible before a safety review; a lab value links to its trend (`?tab=labs&lab=<code>`); card headers link to the full tab.

**States handled:** loading skeleton matching the 2x2 card layout, error with retry, rate limited. Not found is handled one level up by the workspace gate (same state for denied and missing). No agent call, so no agent-unavailable state.

**Keyboard:** every drill-down is a link.

## Clinical brief (agentic upgrade, phases C and D)

The tab now leads with the brief from `GET /patients/{id}/brief`: a rule-made headline, a written summary that arrives later from `/brief/summary` (rephrases the rule signals only; shown with the AI tag), **Attention** (worst first, each line opens its record), **What changed** (previous visit, 90 days or 1 year; each line opens its record), **Missing information** and **Latest results**. All of it is rules over the record; the old attention and clinical-summary cards were replaced by it. `lib/source-link.ts` turns a source reference into a workspace URL.

## Layout (UI improvement plan, P0)

Sections in order: Attention (flagged results with range and movement, plus Review safety), Clinical overview (clinical summary beside latest results), a 12-month snapshot, and Recent activity (diagnoses and date-first events). Medications live on their own tab. The clinical summary is built only from the loaded overview (patient facts), with no model call. Flagged-lab helpers live in `src/lib/abnormal-labs.ts`; the workspace header shows the attention chip (`components/attention-chip.tsx`) and tabs put Claims, Notes, Reports and Similar patients under "More".
