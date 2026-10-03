"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useListState } from "@/lib/use-list-state";
import { useUrlParams } from "@/lib/use-url-params";

/**
 * Claims and utilisation. Status, date range, sort and page live in the URL and are applied by the API to every
 * claim. ?claim=<id> marks the claim a timeline event pointed at (shown when it is on the current page).
 */
export function useClaims(patientId: string) {
  const list = useListState({
    filters: ["status", "from", "to"],
    defaultSort: "date",
    defaultOrder: "desc",
    defaultSize: 25,
  });
  const { params: url } = useUrlParams();
  const query = useQuery({
    queryKey: patientKeys.claims(patientId, list.apiParams),
    queryFn: () => endpoints.claims(patientId, list.apiParams),
    placeholderData: keepPreviousData,
  });
  return { ...list, query, highlighted: url.get("claim") ?? undefined };
}
