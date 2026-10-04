# Documentation

**Purpose:** the shareable user guide: getting started, each screen, how answers are produced, the Snowflake platform underneath, security, limits, FAQ, shortcuts. Written for clinicians, not developers.

**Layout:** its own frame (`layout.tsx`), separate from the workstation shell: slim header with theme, Save as PDF and Open workspace; a contents list that follows the reader; a reading column. Print hides the header and contents.

**Endpoints:** none. Static content in `lib/`: `sections.ts` (guide), `sections-platform.ts` (Snowflake and architecture), `sections-trust.ts`; contents order in `lib/groups.ts`. The Snowflake feature list is shared with sign-in from `src/lib/snowflake-features.ts`.

**Requirement IDs:** UI improvement plan P0.4.

**States handled:** static page, so no loading, empty or error state. No patient data, so no synthetic banner.

**Access:** still behind the sign-in gate (`src/proxy.ts`); add `/docs` to its public prefixes to share without an account.

**Keyboard:** contents are plain anchor links with `aria-current` on the section being read; tables scroll by keyboard.

**Keep current:** edit the section files when a screen, shortcut, limitation or Snowflake feature changes.
