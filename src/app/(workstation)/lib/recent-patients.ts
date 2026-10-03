const STORAGE_KEY = "medynium-recent-patients";
const MAX = 5;

export interface RecentPatient {
  id: string;
  name: string;
}

/** Patients opened from the search, newest first. Only the id and name are kept, in this browser only. */
export function readRecentPatients(): RecentPatient[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is RecentPatient =>
          typeof item?.id === "string" && typeof item?.name === "string",
      )
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function rememberPatient(patient: RecentPatient) {
  const next = [patient, ...readRecentPatients().filter((p) => p.id !== patient.id)].slice(0, MAX);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Blocked storage: recents just stay empty.
  }
}
