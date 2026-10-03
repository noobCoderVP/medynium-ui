"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useListState } from "@/lib/use-list-state";
import { useUrlParams } from "@/lib/use-url-params";

/**
 * The latest result per test (searchable, filterable by flag, sorted and paged by the API) plus the selected
 * test's trend. The selection is ?lab=<code>.
 */
export function useLabs(patientId: string) {
  const { params, update } = useUrlParams();
  const code = params.get("lab") ?? "";
  const state = useListState({
    filters: ["flag"],
    defaultSort: "test",
    defaultOrder: "asc",
    defaultSize: 25,
  });
  const list = useQuery({
    queryKey: patientKeys.labs(patientId, state.apiParams),
    queryFn: () => endpoints.labs(patientId, state.apiParams),
    placeholderData: keepPreviousData,
  });
  const trend = useQuery({
    queryKey: patientKeys.trend(patientId, code),
    queryFn: () => endpoints.labTrend(patientId, code),
    enabled: Boolean(code),
  });
  return { ...state, list, trend, code, select: (next: string | null) => update({ lab: next }) };
}
