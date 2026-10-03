/** URL contract for the Why? drawer: ?why=<answer id>&stmt=<statement id>&ref=<evidence id> (06 section 3). */
export const WHY = "why";
export const STMT = "stmt";
export const REF = "ref";

/** The evidence ids that belong to one statement, from the answer's statement map. */
export function evidenceFor(
  map: Record<string, string[]>,
  statementId: string | null,
): Set<string> {
  return new Set(statementId ? (map[statementId] ?? []) : []);
}

/** "P" ids are patient records, "Q" SQL, "S" source chunks. */
export function evidenceKind(id: string): "patient" | "sql" | "source" {
  return id.startsWith("P") ? "patient" : id.startsWith("Q") ? "sql" : "source";
}
