"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { useNotes } from "../hooks/use-notes";
import { NoteList } from "./note-list";
import { NoteReader } from "./note-reader";

const TYPES = [
  { value: "ED_NOTE", label: "Emergency note" },
  { value: "DISCHARGE_SUMMARY", label: "Discharge summary" },
  { value: "OUTPATIENT_NOTE", label: "Outpatient note" },
];

export function NotesTab({ patientId }: { patientId: string }) {
  const notes = useNotes(patientId);
  const { list, note, noteId, open } = notes;
  return (
    <div className="space-y-3">
      <ListToolbar
        search={{ value: notes.text, onChange: notes.setText, label: "Search notes" }}
        sort={{
          always: true,
          options: [
            { key: "date", label: "Date" },
            { key: "title", label: "Title" },
          ],
          value: notes.sort,
          order: notes.order,
          onChange: notes.setSort,
        }}
        activeCount={notes.activeCount}
        onClear={notes.clear}
      >
        <FilterField
          label="Type"
          value={notes.filters.type}
          onChange={(v) => notes.setFilter("type", v)}
          options={TYPES}
        />
      </ListToolbar>
      <DataState
        query={list}
        skeleton={<SkeletonRows rows={5} />}
        isEmpty={(page) => page.total === 0}
        empty={<EmptyState title={copy.empty.notes} />}
      >
        {(page) => (
          <div className="grid gap-4 md:grid-cols-[minmax(0,22rem)_1fr] md:items-start">
            <div className="space-y-3">
              <NoteList notes={page.items} selected={noteId} onOpen={open} />
              <Pagination
                noun="notes"
                total={page.total}
                offset={notes.offset}
                limit={notes.limit}
                onOffsetChange={notes.setOffset}
                onLimitChange={notes.setLimit}
              />
            </div>
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
    </div>
  );
}
