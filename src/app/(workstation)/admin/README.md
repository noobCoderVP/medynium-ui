# Admin

**Purpose:** manage and prove. Landing shows platform health, the knowledge corpus status and the golden report. Sub-pages: `users/` (users, status, entitlements, password reset) and `invites/`.

**Endpoints:** `GET /health/details`, `GET /knowledge/status`. Golden report endpoints (`/admin/golden-runs`) are not built; the card says so.

**Requirement IDs:** FR-02, FR-24, FR-25, SEC-04, SEC-06, G3.

**Access:** doctors flagged `is_admin` only. `layout.tsx` wraps everything in `AdminGate` (from `features/session`) and the nav hides Admin for others. This is a courtesy: every admin endpoint refuses non-admins with `403 forbidden` on the server.

**States handled:** loading skeletons, error with retry, rate limited, "your role can't open this page" for non-admins.

**Keyboard:** sub-navigation is links with `aria-current`.
