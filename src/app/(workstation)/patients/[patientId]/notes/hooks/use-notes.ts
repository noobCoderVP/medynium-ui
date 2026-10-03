"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

/** The note list and the open note (?note=<id>). */
export function useNotes(patientId: string) {
  const { params, update } = useUrlParams();
  const noteId = params.get("note") ?? "";
  const list = useQuery({
    queryKey: patientKeys.notes(patientId),
    queryFn: () => endpoints.notes(patientId),
  });
  const note = useQuery({
    queryKey: patientKeys.note(patientId, noteId),
    queryFn: () => endpoints.note(patientId, noteId),
    enabled: Boolean(noteId),
  });
  return { list, note, noteId, open: (id: string | null) => update({ note: id }) };
}
