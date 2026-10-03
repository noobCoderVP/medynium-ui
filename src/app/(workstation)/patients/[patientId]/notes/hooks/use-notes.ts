"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useListState } from "@/lib/use-list-state";
import { useUrlParams } from "@/lib/use-url-params";

/** The note list (searched, filtered by type, sorted and paged by the API) and the open note (?note=<id>). */
export function useNotes(patientId: string) {
  const { params, update } = useUrlParams();
  const noteId = params.get("note") ?? "";
  const state = useListState({
    filters: ["type"],
    defaultSort: "date",
    defaultOrder: "desc",
    defaultSize: 10,
  });
  const list = useQuery({
    queryKey: patientKeys.notes(patientId, state.apiParams),
    queryFn: () => endpoints.notes(patientId, state.apiParams),
    placeholderData: keepPreviousData,
  });
  const note = useQuery({
    queryKey: patientKeys.note(patientId, noteId),
    queryFn: () => endpoints.note(patientId, noteId),
    enabled: Boolean(noteId),
  });
  return { ...state, list, note, noteId, open: (id: string | null) => update({ note: id }) };
}
