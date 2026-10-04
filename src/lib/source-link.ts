import type { SourceRef } from "@/lib/api/types";

/**
 * The workspace URL that opens the record an item came from: a lab opens its trend, a note opens that note, a
 * medicine opens the Medications tab. The API names the tab and any extra parameters; this only writes the URL.
 */
export function sourceHref(patientId: string, source: SourceRef | null | undefined): string {
  const base = `/patients/${encodeURIComponent(patientId)}`;
  if (!source) return base;
  const params = new URLSearchParams();
  if (source.tab && source.tab !== "overview") params.set("tab", source.tab);
  for (const [key, value] of Object.entries(source.query ?? {})) params.set(key, value);
  if (source.type === "note" && source.id) params.set("note", source.id);
  const text = params.toString();
  return text ? `${base}?${text}` : base;
}

/**
 * The same, from a stored evidence row (table and record id), for the Why? panel. Returns null when the row has no
 * screen of its own (a query result, for example).
 */
export function evidenceHref(
  patientId: string | null | undefined,
  table: string,
  recordId: string | null | undefined,
  value: string,
): { href: string; label: string } | null {
  if (!patientId) return null;
  const base = `/patients/${encodeURIComponent(patientId)}`;
  switch (table) {
    case "CLINICAL.LAB_RESULT": {
      const code = /^[A-Za-z][A-Za-z0-9 ]*?(?=\s+-?\d)/.exec(value)?.[0]?.trim();
      return {
        href: code ? `${base}?tab=labs&lab=${encodeURIComponent(code)}` : `${base}?tab=labs`,
        label: "Open the lab",
      };
    }
    case "CLINICAL.MEDICATION":
      return { href: `${base}?tab=medications`, label: "Open medications" };
    case "CLINICAL.CLINICAL_NOTE":
      return {
        href: `${base}?tab=notes${recordId ? `&note=${encodeURIComponent(recordId)}` : ""}`,
        label: "Open the note",
      };
    case "CLINICAL.DIAGNOSIS":
    case "CLINICAL.ALLERGY":
      return { href: base, label: "Open overview" };
    case "CLINICAL.ENCOUNTER":
      return { href: `${base}?tab=timeline`, label: "Open timeline" };
    case "CLINICAL.CLAIM":
      return { href: `${base}?tab=claims`, label: "Open claims" };
    case "CLINICAL.REPORT":
      return { href: `${base}?tab=reports`, label: "Open the report" };
    case "ANALYTICS.FINDING":
      return { href: `${base}?tab=safety`, label: "Open findings" };
    default:
      return null;
  }
}
