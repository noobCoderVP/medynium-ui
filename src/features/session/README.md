# features/session

**Purpose:** who is signed in. One `useMe()` query shared by the shell, the admin gate and role-aware navigation, and `useSignOut()`.

**Endpoints:** `GET /me`, `POST /auth/logout`. Refresh and the 401 redirect live in `src/lib/api/client.ts`.

**Requirement IDs:** FR-01, FR-02, SEC-01, SEC-04.

**Public surface (`index.ts`):** `useMe`, `useSignOut`, `AdminGate` (doctor with `is_admin` only).

**States handled:** loading skeleton, error with retry, and a plain "your role can't open this page" for non-admins. The server enforces admin access too; the gate is a courtesy, not the boundary.

**Imports:** `@/lib/*` and `@/components/*` only. Other code imports this folder through `index.ts`.
