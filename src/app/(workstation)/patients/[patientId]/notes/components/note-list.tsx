import { formatDate } from "@/lib/format";
import type { NoteSummary } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/** Notes in the order the API returned them. Each is a button that opens the reader, so selection works by keyboard. */
export function NoteList({
  notes,
  selected,
  onOpen,
}: {
  notes: NoteSummary[];
  selected: string;
  onOpen: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {notes.map((note) => (
        <li key={note.note_id}>
          <button
            type="button"
            aria-current={note.note_id === selected ? "true" : undefined}
            onClick={() => onOpen(note.note_id)}
            className={cn(
              "block w-full border-l-2 border-transparent px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60",
              note.note_id === selected && "border-primary bg-accent hover:bg-accent",
            )}
          >
            <span className="block font-medium">{note.title}</span>
            <span className="block text-xs text-muted-foreground">
              {formatDate(note.date)}
              {note.type ? ` · ${note.type}` : ""}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
