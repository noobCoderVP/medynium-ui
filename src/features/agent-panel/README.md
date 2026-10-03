# features/agent-panel

**Purpose:** ask or do. The collapsible assistant: scope pill, conversation, route chip, live steps, answers, refusals, and the command bar in the top bar.

**Endpoints:** `POST /copilot/ask` (server-sent events, read by `src/lib/api/sse.ts`). Pins from an action refresh `GET /patients/{id}/pins`.

**Requirement IDs:** FR-16 to FR-23, NFR-13, AI-01, AI-04, AI-10, SEC-11, SEC-12.

**Public surface (`index.ts`):** `AgentProvider`, `useAgent`, `AgentPanel`, `AskForm`, `PanelToggle`, `AgentActivity`.

**How it stays optional:**

- It only calls the same API as the workspace. An `action` event maps to a URL (`lib/conversation.ts#hrefForAction`): open patient, `?tab=timeline&from=&to=`, `?tab=labs&lab=`, `?tab=safety`. The workspace then renders from the URL as it always does, so every action has a manual control (FR-20).
- Collapsed, failing or rate-limited, the panel shows its own state and nothing else changes.
- Navigation and read-only actions run directly. Anything that saves goes through the preview-and-approve dialog on the patient page, not through the agent.

**Scope:** the open patient comes from the route (`/patients/[patientId]`); the pill shows its name, or "No patient in scope". The server re-checks entitlement on every call; the id the browser sends is never proof of access.

**States:** running (live steps, a polite live region), answer (announced once on completion), refusal (calm and scoped), not found (same wording for denied and missing), agent unavailable or timeout (panel-only banner with retry), rate limited (countdown), network error.

**Keyboard:** panel toggle is a button with `aria-expanded`; the form is a single field with Send/Stop; steps expand with `<details>`.

**Imports:** `@/lib/*`, `@/components/*`, and `@/features/evidence` through its `index.ts`.
