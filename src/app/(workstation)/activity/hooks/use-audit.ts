"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { auditKeys } from "@/lib/api/keys";
import { useListState } from "@/lib/use-list-state";

/** The signed-in user's own audit entries. Search, filters, sort and page live in the URL; the API does the work. */
export function useAudit() {
  const list = useListState({
    filters: ["action", "outcome", "from", "to"],
    defaultSort: "when",
    defaultOrder: "desc",
    defaultSize: 25,
  });
  const query = useQuery({
    queryKey: auditKeys.list(list.apiParams),
    queryFn: () => endpoints.audit(list.apiParams),
    placeholderData: keepPreviousData,
  });
  return { ...list, query };
}
