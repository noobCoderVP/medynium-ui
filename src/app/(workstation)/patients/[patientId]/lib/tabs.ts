/**
 * `tier` is the narrowest breakpoint at which a tab is a link in the bar: 1 always (from 768 px), 2 from 1024 px,
 * 3 from 1280 px. Tabs that do not fit sit under "More", which only shows while one of them is hidden.
 */
export const TABS = [
  { id: "overview", label: "Overview", tier: 1 },
  { id: "timeline", label: "Timeline", tier: 1 },
  { id: "medications", label: "Medications", tier: 2 },
  { id: "labs", label: "Labs", tier: 2 },
  { id: "safety", label: "Safety review", tier: 2 },
  { id: "claims", label: "Claims", tier: 3 },
  { id: "notes", label: "Notes", tier: 3 },
  { id: "reports", label: "Reports", tier: 3 },
  { id: "similar", label: "Similar patients", tier: 3 },
] as const;

export type TabId = (typeof TABS)[number]["id"];

/** The active tab comes from ?tab=. Anything unknown falls back to the overview. */
export function parseTab(value: string | string[] | undefined): TabId {
  const text = Array.isArray(value) ? value[0] : value;
  return TABS.find((tab) => tab.id === text)?.id ?? "overview";
}
