import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { NoteDetail } from "@/lib/api/types";

/**
 * Note text is always shown as plain text. It is never interpreted, linked or run, so instruction-like text
 * inside a note (for example the S5 test note) is just words on the page (SEC-12, AI-06).
 */
export function NoteReader({ note }: { note: NoteDetail }) {
  return (
    <Card aria-labelledby="note-title">
      <CardHeader>
        <CardTitle>
          <span id="note-title">{note.title}</span>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <p className="mb-3 text-xs text-muted-foreground">
          {formatDate(note.date)}
          {note.type ? ` · ${note.type}` : ""}
          {note.author ? ` · ${note.author}` : ""}
          {note.encounter_id ? ` · encounter ${note.encounter_id}` : ""}
        </p>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{note.body}</div>
      </CardBody>
    </Card>
  );
}
