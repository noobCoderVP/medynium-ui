# Patients list

**Purpose:** find a patient inside the signed-in user's entitled set. Search, "only patients with changes" filter, sortable table with change flags, paging.

**Endpoints:** `GET /patients?q=&changed=&limit=&offset=`.

**Requirement IDs:** FR-03, FR-17, SEC-04, SEC-05.

**URL state:** `?q=` (debounced 300 ms), `?changed=1`, `?offset=`. The top-bar search sends people here with `?q=`.

**States handled:** loading skeleton, empty ("No patients match..."), error with retry, rate limited, previous page kept visible while the next loads.

**Keyboard:** header buttons sort (`aria-sort`); names are links; Previous and Next are buttons; the range text is a polite live region.

**Note:** the patient workspace lives in `[patientId]/` with its own README. Searching never reveals patients outside the entitled set; the server decides what is in the list.
