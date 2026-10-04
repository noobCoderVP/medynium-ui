import type { Dashboard, WorklistItem } from "@/lib/api/types";

/** Plain-word priority, derived only from the flags the API already returns (no new clinical scoring). */
export type Priority = "high" | "review" | "info" | "stable";

export function priorityOf(p: WorklistItem): Priority {
  const types = p.flags.map((f) => f.type);
  if (types.includes("RECENT_EMERGENCY")) return "high";
  if (types.includes("NEW_LAB") || types.includes("NEW_MEDICATION")) return "review";
  if (types.length > 0) return "info";
  return "stable";
}

/** The counts that explain why these patients are listed. */
export function attentionReasons(data: Dashboard) {
  return {
    emergencies: data.worklist.filter((p) => priorityOf(p) === "high").length,
    abnormalLabs: data.recent_changes.labs.filter((l) => l.abnormal).length,
    medicationChanges: data.recent_changes.medications.length,
  };
}

/** Maps a free-text medication change onto the shared change vocabulary. */
export function medicationKind(change: string): "new" | "increased" | "decreased" | "updated" {
  const c = change.toLowerCase();
  if (c.includes("start") || c.includes("new")) return "new";
  if (c.includes("increas")) return "increased";
  if (c.includes("decreas") || c.includes("reduc")) return "decreased";
  return "updated";
}

/** Groups rows by patient, keeping the order in which each patient first appears. */
export function groupByPatient<T extends { patient_id: string; name: string }>(rows: T[]) {
  const groups = new Map<string, { patient_id: string; name: string; rows: T[] }>();
  for (const row of rows) {
    const group = groups.get(row.patient_id) ?? {
      patient_id: row.patient_id,
      name: row.name,
      rows: [],
    };
    group.rows.push(row);
    groups.set(row.patient_id, group);
  }
  return [...groups.values()];
}
