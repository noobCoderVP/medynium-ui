"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useListState } from "@/lib/use-list-state";

/**
 * Text, date range, event types, order and page live in the URL (?q=&from=&to=&types=&order=&offset=), so a
 * filtered timeline is linkable and the assistant's "show timeline" action only has to set these params (06
 * section 3). The API filters every event, then cuts the page.
 */
export function useTimeline(patientId: string) {
  const list = useListState({
    filters: ["from", "to", "types"],
    defaultSort: "date",
    defaultOrder: "desc",
    defaultSize: 10,
  });
  const query = useQuery({
    queryKey: patientKeys.timeline(patientId, list.apiParams),
    queryFn: () => endpoints.timeline(patientId, list.apiParams),
    placeholderData: keepPreviousData,
  });
  const types = list.filters.types;
  return {
    ...list,
    query,
    selectedTypes: types ? types.split(",") : [],
    setTypes: (next: string[]) => list.setFilter("types", next.join(",")),
  };
}
