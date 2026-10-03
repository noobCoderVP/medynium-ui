# Workstation shell

**Purpose:** the frame every signed-in screen sits in: synthetic-data banner, top bar (brand, patient search, ask-or-do command bar, assistant toggle, theme, user), navigation, the scrolling workspace, the assistant slot, the activity strip, and the Why? drawer.

**Endpoints:** `GET /me` (through `features/session`). The assistant and drawer own their own calls.

**Requirement IDs:** FR-16, FR-20, NFR-13, SEC-08, AI-07.

**Layout by width:** 1280 and up: nav with labels, workspace and assistant side by side. 1024 to 1279: icon nav, search and command bar still in the top bar, assistant is an overlay. 768 to 1023: icon nav, search is an icon, the Ask AI button opens the assistant. Under 768: bottom tabs (three primary destinations plus More), assistant is a bottom sheet, drawer is full screen.

**User control:** the nav toggle (or Ctrl/Cmd + B) collapses or expands the rail and the choice is kept in `localStorage` (`medynium-sidebar`); with no choice the width decides. Collapsed icons show a tooltip on hover and focus. The assistant can be resized from 320 to 480 px (drag the edge or use the arrow keys); see `features/agent-panel`. The account button opens a menu with name, role and Sign out.

**Rules:**

- The workspace never depends on the assistant. `AgentPanel` and `EvidenceDrawer` are lazy-loaded and, if they fail, the page still works.
- The banner is rendered here, so every screen that shows patient data has it.
- Admin navigation is hidden for non-admins (courtesy; the API enforces it).
- Auth gate: `src/proxy.ts` (no session cookie goes to sign-in) plus the client's 401 handling.

**States handled:** `useMe` loading and failure leave the nav usable without Admin; sign-out clears all cached data.

**Keyboard:** skip-to-content link first; nav is a `<nav>` with `aria-current="page"`; the sidebar and assistant toggles report `aria-expanded`; Ctrl/Cmd + B toggles the sidebar; the assistant resize edge is a focusable separator.

**Command palette:** Ctrl/Cmd + K (or the top-bar button) opens one box for sections, view actions (sidebar, theme, assistant, focus mode), patients (same API search as the top bar) and "Ask the assistant". It adds no capability the manual controls lack (FR-20). Commands live in `hooks/use-commands.ts`; matching is `lib/commands.ts`.

**Focus mode:** Ctrl/Cmd + Shift + F (or the top-bar button) hides the nav, assistant, activity strip and bottom tabs, leaving the workspace and a slim bar with Exit focus. It lasts for the visit; the synthetic-data banner stays (it comes from the root layout).

**Recent patients:** patients opened from the search are remembered in this browser (id and name only, up to five) and shown in the phone search panel.
