# Knowledge

**Purpose:** "Find what the label says." Search the indexed openFDA drug labels by generic name, Indian brand name, topic or drug. Results are retrieved sections with a complete citation, never generated text.

**Endpoints:** `GET /knowledge/search?q=&drug=&section=&limit=`, `GET /knowledge/drugs`, `GET /knowledge/status`.

**Requirement IDs:** FR-12 to FR-15, AI-06, AI-07.

**Layout:** a drug rail (wide screens; a select in the search bar on narrow ones), the search bar with a section filter, then results, then the index status card.

**URL state:** `?q=metformin+renal&drug=Metformin+hydrochloride&section=Warnings`. Typing searches after a short pause and Enter searches at once; the back button restores earlier searches.

**Modes:** with text, a search (brand names, prefixes and small typos resolve to the generic). With only a drug, the page browses that drug's sections, safety sections first ("Show more sections" raises the cap from 10 to 25).

**Citation block (every result):** drug, section, document title, version, effective date, retrieved date, source and page, plus the matching passage (query words marked) and the whole section on demand. Conflicting sources are marked and both are listed (AI-06).

**Brand names:** when the API resolves a brand or a misspelling to its generic, the summary line says so ("Glycomet read as Metformin hydrochloride").

**States handled:** nothing searched yet (example searches), loading, empty (the API's message, the snapshot date and "Did you mean" drug buttons), error with retry, rate limited. The index status card shows what is covered, so an empty result is read against real coverage. The search makes no model call, so there is no agent-unavailable state.

**Keyboard:** native form controls; the drug rail is a list of toggle buttons (`aria-pressed`); the whole-section disclosure is a native `<details>`.
