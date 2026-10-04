import { FileText } from "lucide-react";
import { DoctorLine } from "@/components/shared/doctor-line";
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
    <ul
      className="divide-y divide-border"
      onKeyDown={(e) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const items = [...e.currentTarget.querySelectorAll<HTMLElement>("button")];
        const at = items.indexOf(document.activeElement as HTMLElement);
        if (at < 0) return;
        e.preventDefault();
        const next = Math.min(items.length - 1, Math.max(0, at + (e.key === "ArrowDown" ? 1 : -1)));
        items[next]?.focus();
      }}
    >
      {notes.map((note) => {
        const on = note.note_id === selected;
        return (
          <li key={note.note_id}>
            <button
              type="button"
              aria-current={on ? "true" : undefined}
              onClick={() => onOpen(note.note_id)}
              className={cn(
                "flex w-full items-start gap-3 border-l-[3px] border-transparent px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60 focus-visible:bg-muted/60",
                on && "border-primary bg-accent hover:bg-accent",
              )}
            >
              <FileText
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  on ? "text-primary" : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate font-medium">{note.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {formatDate(note.date)}
                  {note.type ? ` · ${note.type}` : ""}
                </span>
                <DoctorLine doctor={note.doctor} />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
