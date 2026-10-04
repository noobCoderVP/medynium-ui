import type { TimelineEvent } from "@/lib/api/types";

export type EventType = TimelineEvent["type"];

export const EVENT_LABELS: Record<EventType, string> = {
  ENCOUNTER: "Visit",
  DIAGNOSIS: "Diagnosis",
  MEDICATION_START: "Medicine started",
  MEDICATION_CHANGE: "Medicine changed",
  LAB_PANEL: "Lab results",
  CLAIM: "Claim",
  NOTE: "Note",
};

export const EVENT_TYPES = Object.keys(EVENT_LABELS) as EventType[];

/** Where the underlying record opens: the tab for that kind of record, deep-linked where one exists. */
export function recordHref(patientId: string, event: TimelineEvent): string {
  const base = `/patients/${encodeURIComponent(patientId)}`;
  switch (event.type) {
    case "MEDICATION_START":
    case "MEDICATION_CHANGE":
      return `${base}?tab=medications&status=all`;
    case "LAB_PANEL":
      return `${base}?tab=labs`;
    case "CLAIM":
      return `${base}?tab=claims&claim=${encodeURIComponent(event.record.id)}`;
    case "NOTE":
      return `${base}?tab=notes&note=${encodeURIComponent(event.record.id)}`;
    default:
      return `${base}?tab=overview`;
  }
}
