# Invite and password reset

**Purpose:** a new user sets a password from an invite link, or an existing user sets a new one from an admin reset link. Both links use the same screen; `kind` (`INVITE` or `PASSWORD_RESET`) decides the wording.

**Endpoints:** `GET /auth/invites/{token}` (preview), `POST /auth/invites/accept`.

**Requirement IDs:** FR-02, SEC-01, ADR on invites in `medynium-apis/docs/architecture/decisions.md`.

**States handled:** loading skeleton, invalid or expired link (a single neutral message, whether the token never existed or was used), server error with retry, field errors (empty, mismatch), password-rule failures shown in the server's own words, success with a link to sign in.

**Keyboard:** labelled fields in natural order; errors tied with `aria-describedby`.

**Note:** no patient data here, so no synthetic banner.
