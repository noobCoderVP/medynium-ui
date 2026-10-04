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
  // With nothing chosen the newest note opens, so the reader pane is never an empty box beside a full list.
  const firstId = list.data?.items[0]?.note_id ?? "";
  const openId = noteId || firstId;
  const note = useQuery({
    queryKey: patientKeys.note(patientId, openId),
    queryFn: () => endpoints.note(patientId, openId),
    enabled: Boolean(openId),
  });
  return {
    ...state,
    list,
    note,
    noteId: openId,
    open: (id: string | null) => update({ note: id }),
  };
}
