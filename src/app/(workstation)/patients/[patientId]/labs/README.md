# Patient: Labs

**Purpose:** latest versus previous result per test with the reference range, and a trend for one test.

**Endpoints:** `GET /patients/{id}/labs`, `GET /patients/{id}/labs/{code}/trend`.

**Requirement IDs:** FR-04, FR-05, FR-16, NFR-10.

**URL state:** `?tab=labs&lab=33914-3`. The assistant's lab-trend action sets `lab`; choosing a test name by hand sets the same param.

**The chart:** a small custom SVG (`lib/chart.ts` does the layout and the text summary, both unit-tested). The reference range is a shaded band, or a dashed line when only one limit is known. Every point is keyboard-focusable and named with its date and value. A text summary and a table of the same values always accompany the chart, so it is never the only way to read the data.

**States handled:** loading skeletons for the list and for the trend separately, empty, error with retry for each, rate limited. A lab code that does not belong to the patient returns the standard not-found.

**Keyboard:** test names are buttons (`aria-pressed`); data points tab-focus; Close trend is a button.
