export const ACTIONS = [
  "ASK",
  "RUN_SAFETY_REVIEW",
  "OPEN_PATIENT",
  "SHOW_TIMELINE",
  "PIN_EVIDENCE",
  "SAVE_VIEW",
  "EMAIL_SUMMARY",
  "DENIED_PATIENT",
  "DENIED_ACTION",
] as const;

export const OUTCOMES = ["OK", "REFUSED", "DENIED", "ACTION_NOT_ALLOWED", "ERROR"] as const;

export const humanize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");

/** Outcomes are shown by text as well as tone (never colour alone). */
export const outcomeTone = (outcome: string): "ok" | "warn" | "crit" | "muted" =>
  outcome === "OK" ? "ok" : outcome === "ERROR" ? "crit" : outcome === "REFUSED" ? "muted" : "warn";
