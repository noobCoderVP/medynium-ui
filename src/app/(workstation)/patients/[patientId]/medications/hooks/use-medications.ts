"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useListState } from "@/lib/use-list-state";

/**
 * Search, "current or all", sort and page live in the URL (?q=&status=&sort=&order=&offset=&size=). The API
 * filters and sorts every medicine on record before it cuts the page.
 */
export function useMedications(patientId: string) {
  const list = useListState({
    filters: ["status"],
    defaultSort: "started",
    defaultOrder: "desc",
    defaultSize: 10,
  });
  const query = useQuery({
    queryKey: patientKeys.medications(patientId, list.apiParams),
    queryFn: () => endpoints.medications(patientId, list.apiParams),
    placeholderData: keepPreviousData,
  });
  return { ...list, query };
}
