"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { useNotes } from "../hooks/use-notes";
import { NoteList } from "./note-list";
import { NoteReader } from "./note-reader";

export function NotesTab({ patientId }: { patientId: string }) {
  const { list, note, noteId, open } = useNotes(patientId);
  return (
    <DataState
      query={list}
      skeleton={<SkeletonRows rows={5} />}
      isEmpty={(rows) => rows.length === 0}
      empty={<EmptyState title={copy.empty.notes} />}
    >
      {(notes) => (
        <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_1fr]">
          <NoteList notes={notes} selected={noteId} onOpen={open} />
          <div aria-live="polite">
            {noteId ? (
              <DataState query={note} skeleton={<SkeletonRows rows={4} />}>
                {(detail) => <NoteReader note={detail} />}
              </DataState>
            ) : (
              <EmptyState title="Choose a note to read it." />
            )}
          </div>
        </div>
      )}
    </DataState>
  );
}
