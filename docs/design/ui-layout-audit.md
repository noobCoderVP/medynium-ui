# UI layout audit and checklist

Audit of every screen's layout (October 2026), the findings, and the checklist the fixes were built from. Tick state
reflects what shipped in this pass; open items are listed at the end.

## Screens audited

| Screen                                         | Layout before                                                    | Main problems                                                                    |
| ---------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Shell (top bar, rail, workspace, agent panel)  | Fixed frame; the whole workspace scrolls under a scrolling title | Title scrolls away; panel and canvas tones too close                             |
| Dashboard                                      | Tiles, then worklist (left) and two stacked card lists (right)   | Right column set the page height; left column ended on bare surface; page scroll |
| Patients                                       | Heading, toolbar, table, pagination in one flowing page          | Whole page scrolls with the table; header row blends into the page               |
| Patient workspace and 9 tabs                   | Header card, sticky tab bar, tab content in flowing page         | Weak box separation; section labels and card titles unstyled                     |
| Knowledge                                      | 17rem drug rail + results column                                 | Rail height guessed with `calc(100vh - 18rem)`; result cards barely lift         |
| Activity log, Admin (overview, users, invites) | Heading, toolbar, table, pagination                              | Same as Patients                                                                 |
| Docs, auth pages, 404                          | Single column / centred card                                     | Heading style differs from workspace pages                                       |

## Findings (root causes)

1. **Three surfaces too close in tone.** canvas 0.935, workspace 0.982, card 1.0 with a 0.9 border and `shadow-xs`: boxes
   do not read as boxes.
2. **Table header** used `bg-muted` (0.955), the same tone as the page, so the header row vanished.
3. **Headings** were near-black body colour with a different size on every page (`text-2xl/3xl` page title, `text-lg`
   section title, `text-sm` card title, `text-xs` uppercase labels), and the page title carried a border and `pb-4` plus
   `space-y-5` under it, so a lot of vertical space went to the title.
4. **Page height driven by content.** Lists grew the whole workspace; on the dashboard the right column's lists decided
   the page height and the left column stopped short.
5. **Card anatomy** had no divider between header and body, so cards looked like loose text on white.

## Checklist

### Tokens and type

- [x] Separate canvas, workspace, card and border tones clearly in light and dark (`globals.css`)
- [x] One `--heading` colour (brand navy in light, near-white in dark) used by every h1 to h4 and card title
- [x] One type scale: page title `text-xl sm:text-2xl`, section title `text-base`, card title `text-sm`, label `text-xs` uppercase
- [x] `--table-head` and `--table-head-foreground` tokens, checked by `npm run contrast`

### Shell and spacing

- [x] Page rhythm is one `gap-4`; the title row has no divider and no extra bottom padding
- [x] Pages can opt into a fit-to-viewport layout (`data-fit`) from 1024 px: heading and toolbar stay put, panels scroll inside
- [x] Below 1024 px everything flows as a normal scrolling page

### Components

- [x] `Card`: stronger border and shadow, divider under the header, even padding
- [x] `DataTable`: solid header band with strong bottom rule, sticky header, `fill` (scroll inside the parent) and `bare` (parent supplies the box)
- [x] `ListToolbar`: sits on a card, not on the page tone
- [x] `StatTile` and the utilisation strip lifted to match cards

### Screens

- [x] Dashboard: two equal-height panels (worklist, recent changes), each scrolls inside; no page scroll at 1024 px and up
- [x] Patients, Activity log, Admin users: table box scrolls inside, pagination stays pinned
- [x] Knowledge: drug rail height comes from the layout instead of a viewport guess
- [x] Overview section labels and card titles use the shared heading style

## Not done / follow-up

- Patient workspace tabs still flow as a page (their content is too varied to share one fit layout); the tab bar is sticky.
- Visual check in a browser against live data: the audit and edits were made from code with no signed-in session. The fit-to-viewport chain (no page scroll, equal panels, inner scroll, sticky header) was verified in Chrome on a standalone page with the same structure; the real screens still need an eyeball pass.
- Admin invites and overview, Docs and the auth pages inherit the new tokens and heading style but keep their flowing layout.
