# Forgot password

**Purpose:** let a signed-out user ask for a one-time reset link by email.

**Endpoints:** `POST /auth/password/forgot` (public, always 204). The link lands on `/invite/<token>`, which already handles `kind: PASSWORD_RESET`.

**Requirement IDs:** FR-01, SEC-01.

**States handled:** ready, sending, sent (same wording whether or not the address has an account), rate limited, network error.

**Note:** the API sends the email through Resend. With no `RESEND_API_KEY` it sends nothing; an admin can still issue a reset link from Admin, Users. No patient data here, so no synthetic banner.
