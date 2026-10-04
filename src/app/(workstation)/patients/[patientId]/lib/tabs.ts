export const TABS = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "medications", label: "Medications" },
  { id: "labs", label: "Labs" },
  { id: "claims", label: "Claims" },
  { id: "notes", label: "Notes" },
  { id: "reports", label: "Reports" },
  { id: "similar", label: "Similar patients" },
  { id: "safety", label: "Safety review" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

/** The active tab comes from ?tab=. Anything unknown falls back to the overview. */
export function parseTab(value: string | string[] | undefined): TabId {
  const text = Array.isArray(value) ? value[0] : value;
  return TABS.find((tab) => tab.id === text)?.id ?? "overview";
}
