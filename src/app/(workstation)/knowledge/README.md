# Knowledge

**Purpose:** "Find what the label says." Search the indexed openFDA drug labels, by generic name, Indian brand name or topic. Results are retrieved sections with a complete citation, never generated text.

**Endpoints:** `GET /knowledge/search?q=&drug=&section=`, `GET /knowledge/status`.

**Requirement IDs:** FR-12 to FR-15, AI-06, AI-07.

**URL state:** `?q=metformin+renal&drug=metformin&section=Warnings`. Search runs on submit.

**Citation block (every result):** title, drug, section, version, effective date, retrieved date, source and page, plus the snippet and the whole section on demand. Conflicting sources are marked and both are listed (AI-06).

**Brand names:** when the API resolves a brand to its generic, the result line says so ("Glycomet resolved to metformin").

**States handled:** nothing searched yet, loading, empty ("No matching section in the indexed sources." plus the snapshot date), error with retry, rate limited. The index status card shows what is covered and the snapshot date, so an empty result is read against real coverage. The search makes no model call, so there is no agent-unavailable state.

**Keyboard:** native form controls; results are a list; the whole-section disclosure is a native `<details>`.
