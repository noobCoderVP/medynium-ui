"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { auditKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

export const AUDIT_PAGE = 25;

/** The signed-in user's own audit entries. Filters and paging live in the URL. */
export function useAudit() {
  const { params, update } = useUrlParams();
  const filters = {
    action: params.get("action") ?? "",
    outcome: params.get("outcome") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    offset: Number(params.get("offset") ?? 0) || 0,
  };
  const query = useQuery({
    queryKey: auditKeys.list(filters),
    queryFn: () =>
      endpoints.audit({
        action: filters.action || undefined,
        outcome: filters.outcome || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        limit: AUDIT_PAGE,
        offset: filters.offset,
      }),
    placeholderData: keepPreviousData,
  });
  return {
    query,
    filters,
    setFilter: (key: "action" | "outcome" | "from" | "to", value: string) =>
      update({ [key]: value || null, offset: null }),
    setOffset: (value: number) => update({ offset: value > 0 ? String(value) : null }),
    clear: () => update({ action: null, outcome: null, from: null, to: null, offset: null }),
  };
}
