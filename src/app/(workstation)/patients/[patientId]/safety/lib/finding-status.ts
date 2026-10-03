import type { FindingStatus } from "@/lib/api/types";

type Tone = "ok" | "warn" | "crit" | "muted";

/** Status wording and tone. Every status is shown as text as well as colour. */
export const STATUS: Record<FindingStatus, { label: string; tone: Tone }> = {
  NEW: { label: "Needs a decision", tone: "warn" },
  ACKNOWLEDGED: { label: "Acknowledged", tone: "ok" },
  FLAGGED: { label: "Follow-up set", tone: "warn" },
  DISMISSED: { label: "Dismissed", tone: "muted" },
  ESCALATED: { label: "Escalated", tone: "crit" },
};
