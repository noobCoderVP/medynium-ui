import type { Overview } from "@/lib/api/types";

// View-model aliases over the generated API types.
export type Diagnosis = Overview["diagnoses"][number];
export type OverviewMedication = Overview["medications"][number];
export type OverviewLab = Overview["latest_labs"][number];
export type OverviewEvent = Overview["recent_events"][number];
