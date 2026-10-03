# Admin: Invites

**Purpose:** invite a doctor or a clinic assistant, copy the one-time link (HJ invite flow), and revoke pending invites. Password-reset links created from Users also appear in the list.

**Endpoints:** `POST /admin/invites`, `GET /admin/invites`, `DELETE /admin/invites/{id}`, `GET /admin/users?role=DOCTOR` (for the supervising doctor choice).

**Requirement IDs:** FR-02, FR-24, SEC-01, SEC-04.

**Flow:** fill the form, create, copy the link from the confirmation, send it privately. The invitee opens `/invite/<token>` (see `(auth)/invite`) and sets a password; entitlements are then edited under Users and access.

**States handled:** loading, empty, error with retry, rate limited, field errors, duplicate (409) in plain words, failed revoke.

**Keyboard:** labelled native controls; Revoke buttons are named with the invitee.

**Security notes:** the link is only ever shown in the response to the admin who created it, in a read-only field with a Copy button. It is never logged or placed in the URL of this page.
