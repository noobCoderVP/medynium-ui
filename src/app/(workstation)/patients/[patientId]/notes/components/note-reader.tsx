import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { NoteDetail } from "@/lib/api/types";

/**
 * Note text is always shown as plain text. It is never interpreted, linked or run, so instruction-like text
 * inside a note (for example the S5 test note) is just words on the page (SEC-12, AI-06).
 */
export function NoteReader({ note }: { note: NoteDetail }) {
  const meta = [
    formatDate(note.date),
    note.type,
    note.author,
    note.encounter_id ? `Encounter ${note.encounter_id}` : null,
  ].filter(Boolean);
  return (
    <Card aria-labelledby="note-title" className="overflow-hidden">
      <header className="space-y-1.5 border-b border-border bg-surface-2 px-5 py-4">
        <h2 id="note-title" className="text-base font-semibold">
          {note.title}
        </h2>
        <p className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
          {meta.map((item, i) => (
            <span key={i} className="after:ml-2 after:content-['·'] last:after:content-none">
              {item}
            </span>
          ))}
        </p>
      </header>
      <div className="px-5 py-5 text-sm leading-relaxed whitespace-pre-wrap">{note.body}</div>
    </Card>
  );
}
