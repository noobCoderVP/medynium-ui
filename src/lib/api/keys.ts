/** Query-key factories: one place for keys so invalidation is precise and typos are impossible. */
export const sessionKeys = { me: ["session", "me"] as const };

export const dashboardKeys = {
  all: ["dashboard"] as const,
  briefing: ["dashboard", "briefing"] as const,
};

export const patientKeys = {
  all: ["patients"] as const,
  list: (q: string, changed: boolean, offset: number) =>
    ["patients", "list", { q, changed, offset }] as const,
  detail: (id: string) => ["patients", id, "detail"] as const,
  medications: (id: string, status: string) => ["patients", id, "medications", status] as const,
  labs: (id: string) => ["patients", id, "labs"] as const,
  trend: (id: string, code: string) => ["patients", id, "labs", code, "trend"] as const,
  timeline: (id: string, from: string, to: string, types: string) =>
    ["patients", id, "timeline", { from, to, types }] as const,
  claims: (id: string) => ["patients", id, "claims"] as const,
  notes: (id: string) => ["patients", id, "notes"] as const,
  note: (id: string, noteId: string) => ["patients", id, "notes", noteId] as const,
  pins: (id: string) => ["patients", id, "pins"] as const,
  views: (id: string) => ["patients", id, "views"] as const,
  /** The last safety review run in this session (held in the cache only; the stored evidence is the record). */
  safety: (id: string) => ["patients", id, "safety"] as const,
};

export const evidenceKeys = { one: (answerId: string) => ["evidence", answerId] as const };

export const knowledgeKeys = {
  search: (q: string, drug: string, section: string) =>
    ["knowledge", "search", { q, drug, section }] as const,
  status: ["knowledge", "status"] as const,
};

export const auditKeys = {
  list: (filters: Record<string, string | number>) => ["audit", filters] as const,
};

export const adminKeys = {
  health: ["admin", "health"] as const,
  users: (q: string, status: string) => ["admin", "users", { q, status }] as const,
  entitlements: (id: string) => ["admin", "users", id, "entitlements"] as const,
  invites: ["admin", "invites"] as const,
};
