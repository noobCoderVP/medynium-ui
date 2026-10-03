---
name: slice-done
description: Verify a finished slice in medynium-ui against its done-when check and tick the tracker. Use when a slice or page feature is finished.
---

1. Read the slice in `../Medynium_Implementation_Plan.md` and restate its done-when check.
2. Run `npm run check`; report any failure verbatim.
3. For each touched page, confirm the four states, the synthetic banner, keyboard access and that its README card is current.
4. Confirm the hard rules in AGENTS.md still hold (API only via the client, denied looks missing, manual parity, evidence tags).
5. Tick the tracker in section 8 of the plan only if every item passes; otherwise list what is left.
