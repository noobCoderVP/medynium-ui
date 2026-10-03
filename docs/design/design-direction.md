# Design direction (X-2, X-3)

Status: **built on the plan's proposed starting palette, on your instruction to go ahead. Not formally approved.** Colours are tokens defined once in `src/app/globals.css`, so changing a value restyles the whole app without touching a component. Roles are fixed; values are not.

## Mood

Calm, quiet, dense where a doctor scans (tables, lists) and roomy where they read (answers, notes). Borders over shadows, small radius, no decoration. Colour carries meaning only: brand for actions, one hue per evidence tag, status colours for state. Nothing animates except short fades and a spinner, and nothing animates under reduced motion.

## Roles and values

| Role                   | Use                                         | Light                  | Dark                   |
| ---------------------- | ------------------------------------------- | ---------------------- | ---------------------- |
| `primary` (brand teal) | Actions, links, focus ring                  | `oklch(0.44 0.09 195)` | `oklch(0.78 0.10 190)` |
| `agent` (violet)       | The assistant's surfaces and the route chip | `oklch(0.47 0.17 295)` | `oklch(0.80 0.12 295)` |
| `fact` (blue)          | "Patient fact" tag                          | `oklch(0.42 0.14 255)` | `oklch(0.80 0.10 255)` |
| `source` (teal)        | "Retrieved source" tag                      | `oklch(0.40 0.08 185)` | `oklch(0.82 0.09 185)` |
| `synth` (amber)        | "AI synthesis" tag, always hedged           | `oklch(0.42 0.10 65)`  | `oklch(0.85 0.12 85)`  |
| `warn`, `crit`, `ok`   | Status chips and messages                   | amber, red, green      | lighter variants       |

Each role has a `-soft` background for chips and banners. Neutrals (`background`, `card`, `muted`, `border`, `foreground`, `muted-foreground`) follow shadcn names so the primitives work unchanged.

## Type, density, shape

- Geist Sans for the interface, Geist Mono for ids, SQL and table names; tabular figures on every table.
- Compact tables (40 px rows), comfortable reading panels, 44 px touch targets for tabs and bottom navigation on phones.
- Radius 8 px, borders `1px`, one elevation (drawers and dialogs).
- Icons from `lucide-react`; every icon-only control has an accessible name.

## Contrast (checked, both themes)

`node scripts/check-contrast.mjs` converts every token pair from OKLCH and fails below 4.5:1 for text or 3:1 for control boundaries. **52 of 52 pairs pass.** Lowest text pair: `agent` on `agent-soft`, light, 6.35:1. Lowest boundary pair: `input` on `card`, light, 3.92:1. The tags use text and an icon shape as well as colour.

## Three screens, described

Sketches are described rather than drawn; the running app and the gallery (`/dev/components`) are the visual review.

1. **Dashboard.** Page heading with the as-of date and a disabled "Brief me". A row of six utilisation tiles. The worklist table, sorted so patients with changes come first, each with flag chips ("ED visit 2 Oct", "New lab"). Below it two cards: recent lab results (abnormal first, with the previous value) and recent medication changes. The assistant column sits on the right at 1280 px and wider.
2. **Patient overview with an answer.** Header (name, age and sex, city, id, "Record as of", Views). Tab bar. Overview: utilisation tiles, then medications (each with "label indexed" or "label not indexed"), latest results, diagnoses and recent events, every value with its date and source table. On the Safety tab: the Run button, live steps, then statements. Each statement shows its tag chip, the sentence, a "Why?" button and one button per evidence id.
3. **Why? drawer.** Opens from the right (full screen on a phone). Header line with the answer id, time, route and snapshot date. Three groups: patient records (value, date, table and record id), retrieved sources (title, section, version, dates, quoted text), SQL (role, row count, statement). Items linked to the chosen statement are outlined and marked, and the referenced item scrolls into view. A Pin button sits on each patient record and source.

## What changes if you want a different look

Edit `:root` and `.dark` in `globals.css`, run `node scripts/check-contrast.mjs`, and look at `/dev/components`. Component code uses the tokens, with one exception: the dialog backdrop is a translucent black.
