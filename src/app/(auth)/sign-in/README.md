# Sign in

**Purpose:** authenticate with email and password, and resume a session whose 15-minute access cookie has lapsed.

**Endpoints:** `POST /auth/login`, `POST /auth/refresh` (silent resume).

**Requirement IDs:** FR-01, FR-02, SEC-01, SEC-02.

**Flow:** `src/proxy.ts` sends a visitor with no `med_access` cookie here with `?next=`. The page first tries a silent refresh (the 7-day refresh cookie is only visible to `/api/auth/*`); if it works the visitor goes straight to `next`, otherwise the form shows. `next` is only followed when it is a same-origin path.

**States handled:** resuming, ready, submitting, wrong credentials (one generic message for unknown email, wrong password, disabled or locked), rate limited / locked, network error. Inline field errors are tied with `aria-describedby`; a summary `role="alert"` shows the server outcome.

**Keyboard:** form is a single tab sequence; Enter submits. Focus ring is the global `:focus-visible` style.

**Note:** no patient data here, so no synthetic banner.
