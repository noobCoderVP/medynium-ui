# Usability and accessibility pass (X-7, U-17)

**Status: not yet run.** These are the scripts for the manual pass that closes M6. They need a person at the keyboard against the running stack with the demo accounts. Nothing below is ticked because none of it has been done by hand yet. Record each result in the table and fix or log the finding before M6 exits.

## How to run it

1. Start the API (`poetry run poe dev` in `medynium-apis`) and the UI (`npm run dev` in `medynium-ui`). Set `REFRESH_COOKIE_PATH=/api/auth` in the API's `.env` (see `.env.example`).
2. Sign in as the demo doctor. Credentials are in `~/.medynium/demo_credentials.txt`, outside the repo.
3. Ask someone unfamiliar with the product to do each flow below without help. Note where they hesitate.

## Flows (from 05 section 4)

| Flow               | Do this                                                                                                                       | Pass when                                                                                                                       | Result | Findings |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| HJ-1 Hero          | Dashboard, open the kidney patient (click, then again by asking), Safety tab, Run, read the answer, click Why? on a statement | Steps stream live; every statement has a tag; the drawer lists patient records, SQL and sources and marks the statement's items |        |          |
| HJ-3 Access        | Sign in as the assistant; confirm S3 is not in the worklist; ask for S3 by name in the panel; open S3's URL directly          | The same "We couldn't find that patient." state in all three; nothing hints the patient exists                                  |        |          |
| HJ-4 Honest gap    | Run the safety review on the control patient and on the gap patient                                                           | "No documented consideration found in the indexed sources", with what was checked, what was not, and the snapshot date          |        |          |
| HJ-5 Manual parity | Collapse the assistant; run the same review by hand; open the drawer                                                          | Same evidence and the same drawer                                                                                               |        |          |
| Refusal            | Ask "What should I prescribe?"                                                                                                | A calm scoped refusal and any documented considerations; the chip shows `refuse`                                                |        |          |
| Cheap route        | Ask "What are the current medications?"                                                                                       | Instant answer; chip shows `lookup` and "no model call"                                                                         |        |          |
| Invite             | As admin, invite a user, copy the link, open it in a private window, set a password, sign in                                  | The account works and its entitlements apply                                                                                    |        |          |

## Keyboard checks

| Check                                            | Pass when                                                                    | Result |
| ------------------------------------------------ | ---------------------------------------------------------------------------- | ------ |
| Tab from page load                               | First stop is "Skip to content"; focus ring always visible                   |        |
| Complete HJ-1 with the keyboard only             | Every step reachable and operable                                            |        |
| Open the Why? drawer from a statement button     | Focus moves into the drawer; `Esc` closes it; focus returns to that button   |        |
| Open the Views dialog and the entitlement editor | Same focus behaviour; background is not reachable                            |        |
| Sort a table header                              | Works with Enter and Space; `aria-sort` announced                            |        |
| Lab chart                                        | Points are reachable with Tab and named; the table below has the same values |        |

## Screen-reader checks (NVDA on Windows or VoiceOver on macOS)

| Check                         | Pass when                                                  | Result |
| ----------------------------- | ---------------------------------------------------------- | ------ |
| Streaming steps               | Announced politely, not interrupting                       |        |
| Completed answer              | Announced once                                             |        |
| Tag chips                     | Read as "Patient fact", "Retrieved source", "AI synthesis" |        |
| Form errors (sign-in, invite) | Linked to the field and read on focus                      |        |

## Display checks

| Check                                                              | Pass when                                                                                  | Result |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------ |
| Light and dark                                                     | All screens readable; no clipped text                                                      |        |
| 200% zoom                                                          | No loss of content; no two-way scrolling                                                   |        |
| 390 px width                                                       | No horizontal page scroll; bottom tabs; assistant is a bottom sheet; drawer is full screen |        |
| Reduced motion (OS setting)                                        | No animation                                                                               |        |
| Lighthouse accessibility on dashboard, patient overview, knowledge | Above 95                                                                                   |        |

## Automated checks that already run

- ESLint with `eslint-plugin-jsx-a11y` (part of `next/core-web-vitals`) on every commit.
- `node scripts/check-contrast.mjs`: 52 of 52 token pairs pass in both themes.
- Component tests assert labels, roles, `aria-sort`, `aria-current`, live regions and the not-found state.
- **Not yet added:** an axe check per screen. It needs a dependency (`axe-core` or `jest-axe`), which this repo's rules say to ask about first.
