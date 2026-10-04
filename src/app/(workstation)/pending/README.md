# Pending work

**Purpose:** one list of what is waiting on the signed-in clinician across their own patients (escalated or open findings, follow-ups, reports to review, abnormal labs, recent emergency visits), most urgent first. Each row opens the patient on the tab where it is handled.

**Endpoints:** `GET /pending?kind=&limit=&offset=`, `GET /pending/summary`.

**Requirement IDs:** FR-02, FR-16, NFR-10.

**States handled:** loading skeleton, empty ("Nothing is waiting on you."), error with retry, rate limited.

**Notes:** the API scopes items to the caller's entitled patients; this page never filters by patient itself.
