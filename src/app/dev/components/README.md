# Dev: component gallery

**Purpose:** one page showing every shared component in every state, in light and dark side by side. Used for visual review (X-6) and as the target for axe checks.

**Route:** `/dev/components`. It calls `notFound()` when `NODE_ENV` is `production`, so it never ships.

**What is in it:** role swatches (tokens), buttons and inputs (including an invalid input and a dialog), the full state matrix (loading, empty, not found, error with retry, agent unavailable, rate limited, populated, steps), the evidence vocabulary (three tags, flags, route and status chips, stat tiles, value with source, data table, a populated answer and an honest gap), the list pattern (toolbar with search, filters and a sort menu, a sortable table that becomes cards on phones, and pagination), and a one-time link.

**Why two themes at once:** the dark panel is a wrapper with the `dark` class, so both token sets render on one screen and contrast can be compared without toggling.

**Not here:** page-specific components (the lab trend chart, for example) live in their own page folders and are tested there.
