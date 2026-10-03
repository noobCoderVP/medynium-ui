# Admin: Users and access

**Purpose:** see every user, disable or re-enable an account, issue a password-reset link, and edit which patients a user can see (entitlements).

**Endpoints:** `GET /admin/users`, `PATCH /admin/users/{id}`, `POST /admin/users/{id}/reset-password`, `GET` and `PUT /admin/users/{id}/entitlements`, `GET /patients` (the choice list).

**Requirement IDs:** FR-02, FR-24, SEC-04, SEC-05.

**Entitlement editor:** a dialog with a search, the patients you can assign, and a live "N selected" count. Saving replaces the user's whole list, so nothing is written until Save access. After saving, the user's list and count update. The server enforces entitlements on every request; this screen only edits them.

**Reset link:** shown once in a dialog with a Copy button. It works once and expires.

**URL state:** `?q=&status=`.

**States handled:** loading skeletons (table, editor), empty, error with retry, rate limited, inline error on a failed change.

**Keyboard:** icon-free text buttons, each named with the user it acts on (`aria-label`); dialogs trap and restore focus and close on `Esc`.
