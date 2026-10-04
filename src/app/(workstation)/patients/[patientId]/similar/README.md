# Patient: Similar patients

**Purpose:** other patients among the clinician's own who look like this one (blend of embedding similarity and shared diagnoses, medicines, labs and age), each with the reasons and a lab comparison. It supports a "what did we do for patients like this" conversation; it is decision support, not a recommendation.

**Endpoints:** `GET /patients/{id}/similar?limit=5`.

**Requirement IDs:** FR-02, NFR-10.

**States handled:** loading skeleton, empty (explains that the list is never padded), error with retry, a server note when the patient is not yet indexed (a new patient catches up within seconds). Not found is handled by the workspace gate.

**Notes:** only the signed-in clinician's own patients can appear; the server enforces it. The disclaimer comes from the API and is always shown.
