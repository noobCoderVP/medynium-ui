"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useListState } from "@/lib/use-list-state";

/**
 * Search, filters, sort and page live in the URL (?q=&sex=&kind=&flag=&changed=&sort=&order=&offset=&size=). The
 * API filters and sorts over every entitled patient, then cuts the page, so "of N" is the real total.
 */
export function usePatientList() {
  const list = useListState({
    filters: ["sex", "kind", "flag", "changed"],
    defaultSort: "last_encounter",
    defaultOrder: "desc",
    defaultSize: 25,
  });
  const params = { ...list.apiParams, changed: list.filters.changed === "1" ? true : undefined };
  const query = useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => endpoints.patients(params),
    placeholderData: keepPreviousData,
  });
  return { ...list, query };
}
