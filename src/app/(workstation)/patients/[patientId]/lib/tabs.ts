/**
 * `primary` tabs are links in the bar at every width; the rest sit under "More" below `lg` and are plain tabs from
 * `lg` up, so every view stays linkable.
 */
export const TABS = [
  { id: "overview", label: "Overview", primary: true },
  { id: "timeline", label: "Timeline", primary: true },
  { id: "medications", label: "Medications", primary: true },
  { id: "labs", label: "Labs", primary: true },
  { id: "safety", label: "Safety", primary: true },
  { id: "claims", label: "Claims", primary: false },
  { id: "notes", label: "Notes", primary: false },
  { id: "reports", label: "Reports", primary: false },
  { id: "similar", label: "Similar patients", primary: false },
] as const;

export type TabId = (typeof TABS)[number]["id"];

/** The active tab comes from ?tab=. Anything unknown falls back to the overview. */
export function parseTab(value: string | string[] | undefined): TabId {
  const text = Array.isArray(value) ? value[0] : value;
  return TABS.find((tab) => tab.id === text)?.id ?? "overview";
}
