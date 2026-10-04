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
  "PATIENT_BRIEF",
  "PATIENT_ATTENTION",
  "PATIENT_CHANGES",
  "PATIENT_GAPS",
  "AGENT_PROPOSED_WRITE",
  "AGENT_PROPOSAL_DISCARDED",
] as const;

export const OUTCOMES = ["OK", "REFUSED", "DENIED", "ACTION_NOT_ALLOWED", "ERROR"] as const;

const FRIENDLY: Record<string, string> = {
  PATIENT_BRIEF: "Opened the brief",
  PATIENT_BRIEF_SUMMARY: "Brief summary",
  PATIENT_ATTENTION: "Checked attention",
  PATIENT_CHANGES: "Compared changes",
  PATIENT_GAPS: "Checked gaps",
  AGENT_PROPOSED_WRITE: "Approved a change",
  AGENT_PROPOSAL_DISCARDED: "Discarded a change",
  RUN_SAFETY_REVIEW: "Safety review",
};

export const humanize = (value: string) =>
  FRIENDLY[value] ?? value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");

/** Outcomes are shown by text as well as tone (never colour alone). */
export const outcomeTone = (outcome: string): "ok" | "warn" | "crit" | "muted" =>
  outcome === "OK" ? "ok" : outcome === "ERROR" ? "crit" : outcome === "REFUSED" ? "muted" : "warn";
