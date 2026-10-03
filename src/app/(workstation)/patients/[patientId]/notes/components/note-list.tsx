import { formatDate } from "@/lib/format";
import type { NoteSummary } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/** Notes, newest first. Each is a button that opens the reader, so selection works by keyboard. */
export function NoteList({
  notes,
  selected,
  onOpen,
}: {
  notes: NoteSummary[];
  selected: string;
  onOpen: (id: string) => void;
}) {
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {sorted.map((note) => (
        <li key={note.note_id}>
          <button
            type="button"
            aria-current={note.note_id === selected ? "true" : undefined}
            onClick={() => onOpen(note.note_id)}
            className={cn(
              "block w-full px-4 py-3 text-left text-sm hover:bg-muted",
              note.note_id === selected && "bg-accent",
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
