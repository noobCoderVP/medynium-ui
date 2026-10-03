# Workstation shell

**Purpose:** the frame every signed-in screen sits in: synthetic-data banner, top bar (brand, patient search, ask-or-do command bar, assistant toggle, theme, user), navigation, the scrolling workspace, the assistant slot, the activity strip, and the Why? drawer.

**Endpoints:** `GET /me` (through `features/session`). The assistant and drawer own their own calls.

**Requirement IDs:** FR-16, FR-20, NFR-13, SEC-08, AI-07.

**Layout by width:** 1280 and up: nav with labels, workspace and assistant side by side. 768 to 1279: icon nav, assistant is an overlay. Under 768: bottom tabs, assistant is a bottom sheet, drawer is full screen.

**Rules:**

- The workspace never depends on the assistant. `AgentPanel` and `EvidenceDrawer` are lazy-loaded and, if they fail, the page still works.
- The banner is rendered here, so every screen that shows patient data has it.
- Admin navigation is hidden for non-admins (courtesy; the API enforces it).
- Auth gate: `src/proxy.ts` (no session cookie goes to sign-in) plus the client's 401 handling.

**States handled:** `useMe` loading and failure leave the nav usable without Admin; sign-out clears all cached data.

**Keyboard:** skip-to-content link first; nav is a `<nav>` with `aria-current="page"`; the toggle button reports `aria-expanded`.
