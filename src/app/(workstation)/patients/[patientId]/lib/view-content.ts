import { parseTab } from "./tabs";

/** URL params that belong to the evidence drawer, not to the view itself. */
const TRANSIENT = new Set(["why", "stmt", "ref"]);

/** What a saved view stores: the tab and its filters (date range, lab code, note...), nothing clinical. */
export function contentFromParams(params: URLSearchParams, title: string) {
  const kept: Record<string, string> = {};
  for (const [key, value] of params) {
    if (key !== "tab" && !TRANSIENT.has(key)) kept[key] = value;
  }
  return { title, tab: parseTab(params.get("tab") ?? undefined), params: kept };
}

/** The link that reopens a saved view. Unknown content falls back to the overview. */
export function hrefFromContent(patientId: string, content: Record<string, unknown>): string {
  const query = new URLSearchParams({
    tab: parseTab(typeof content.tab === "string" ? content.tab : undefined),
  });
  const params = content.params;
  if (params && typeof params === "object") {
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string" && !TRANSIENT.has(key)) query.set(key, value);
    }
  }
  return `/patients/${encodeURIComponent(patientId)}?${query.toString()}`;
}
