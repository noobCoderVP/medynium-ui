# Dashboard

**Purpose:** "Show me my patients and who changed." A compact utilisation strip, "Patients needing attention" (the worklist, urgent changes first, with Brief me beside it), and recent lab and medication changes. First screen after sign-in.

**Endpoints:** `GET /dashboard` (one call). `GET /dashboard/briefing` runs only when Brief me is pressed. It is rules over the dashboard data (no model call) and the card says so, one tagged line per change, each linked to its patient.

**Requirement IDs:** FR-17, FR-18, NFR-01, SEC-08.

**Data scope:** whatever the API returns for the signed-in user. The assistant's list excludes S3 because the server's row policy does; the UI never filters.

**Briefing:** on request only, never on load. Shown in a card with a Close button; an error shows the standard error state with retry.

**States handled:** loading skeleton matching the layout, empty worklist (explains why and what to do), error with retry and request id, rate limited with countdown, not found. Agent-unavailable does not apply: this page makes no agent call.

**Keyboard:** worklist columns sort from header buttons (`aria-sort`); each patient name is a link.

**Synthetic banner:** from the shell.
