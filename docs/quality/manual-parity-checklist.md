# Manual parity checklist (Q-9, G7)

Rule 5 of this repo: every assistant action has a manual control, and the workspace stays fully usable with the assistant collapsed or failing (FR-16, FR-20, NFR-13).

**Status: written, not yet ticked.** A box is ticked only by doing the steps below by hand with the assistant panel collapsed. The "Built" column says what exists in code; it is not evidence that the manual run works. The tests that do exist are listed at the end.

## Setup

Sign in as the demo doctor. Collapse the assistant with the **Collapse assistant** button (or the **Assistant** toggle in the top bar). Confirm the workspace layout is unchanged.

## Actions and abilities

| #   | Assistant does this                                | Manual control (assistant collapsed)                                                                                     | Built | Done by hand |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----- | ------------ |
| 1   | `open_patient`: "open the kidney patient"          | Dashboard worklist link, Patients list, or the top-bar "Find a patient" box (search "kidney", open the row)              | yes   | [ ]          |
| 2   | `show_timeline` with a date range                  | Patient, **Timeline** tab, set **From** and **To**; the URL shows `?tab=timeline&from=&to=`                              | yes   | [ ]          |
| 3   | `show_timeline` as a lab trend                     | Patient, **Labs** tab, choose the test name; the URL shows `?tab=labs&lab=`                                              | yes   | [ ]          |
| 4   | `run_safety_review`                                | Patient, **Safety review** tab, **Run safety review**; steps stream; answer shows tagged statements                      | yes   | [ ]          |
| 5   | Open the evidence behind a statement               | **Why?** or an evidence id button on any statement; the drawer opens with the same records, SQL and sources              | yes   | [ ]          |
| 6   | `pin_evidence`                                     | Pin button on an item in the Why? drawer; it then appears under **Pinned evidence** on the Safety tab and can be removed | yes   | [ ]          |
| 7   | "What are the current medications?" (`lookup`)     | **Overview** current medications card, or the **Medications** tab                                                        | yes   | [ ]          |
| 8   | "What changed since the last visit?"               | Dashboard flags and recent changes, or the **Timeline** tab filtered from the previous visit date                        | yes   | [ ]          |
| 9   | Utilisation counts                                 | **Overview** tiles or the **Claims** tab                                                                                 | yes   | [ ]          |
| 10  | "What does the label say about ...?" (`knowledge`) | **Knowledge** page search with the same terms                                                                            | yes   | [ ]          |
| 11  | Brand-name lookup                                  | **Knowledge** page search for the brand; the result says it was resolved to the generic                                  | yes   | [ ]          |

Abilities that exist only by hand (no assistant action): Brief me (Dashboard), Views dialog (patient header), Activity log, Admin.

## Failing assistant (separate pass)

| Check                                    | How                                                                                                            | Done by hand |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------ |
| Assistant down shows its own banner only | Stop Cortex access (use a bad model name in the API's `.env`), ask a question                                  | [ ]          |
| The rest of the page still works         | Open a patient, switch tabs, sort a table, run the Knowledge search                                            | [ ]          |
| Manual safety review under failure       | Run it by hand: it shows the same "assistant is unavailable" banner **in the Safety tab**, nothing else breaks | [ ]          |
| Retry                                    | Restore the setting, press **Try again**                                                                       | [ ]          |

## Tests that already guard this in code

- `features/agent-panel/hooks/agent-context.test.tsx`: an action only changes the URL; a failed or unavailable assistant records a failed turn and never throws; a second question is ignored while one runs.
- `features/agent-panel/lib/conversation.test.ts`: each action maps to the URL the manual control also produces.
- `components/shared/data-state.test.tsx`: agent-unavailable and the other states render in place without affecting siblings.
- `patients/[patientId]/components/patient-workspace.test.tsx`: the tab bar links (Timeline, Labs and the rest) exist for a loaded patient.
- Not covered by a test: the Timeline filter controls, the Labs test selector, the Safety tab button and the Pin button. They are checked only by the manual pass above.
