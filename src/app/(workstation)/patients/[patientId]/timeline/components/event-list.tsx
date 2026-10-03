import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { TimelineEvent } from "@/lib/api/types";
import { EVENT_LABELS, recordHref } from "../lib/event-types";

/** Newest first. Each event links to the record behind it, in the tab that shows that kind of record. */
export function EventList({ patientId, events }: { patientId: string; events: TimelineEvent[] }) {
  return (
    <ol className="divide-y divide-border rounded-lg border border-border bg-card">
      {events.map((event) => (
        <li
          key={event.event_id}
          className="flex flex-wrap items-start justify-between gap-2 px-4 py-3 text-sm"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              <time dateTime={event.date}>{formatDate(event.date)}</time> ·{" "}
              {EVENT_LABELS[event.type]}
            </p>
            <p className="font-medium">{event.title}</p>
            {event.summary ? <p className="text-muted-foreground">{event.summary}</p> : null}
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {event.record.table} {event.record.id}
            </p>
          </div>
          <Link
            href={recordHref(patientId, event)}
            className="shrink-0 text-xs font-medium text-primary hover:underline"
            aria-label={`Open record for ${event.title}`}
          >
            Open record
          </Link>
        </li>
      ))}
    </ol>
  );
}
