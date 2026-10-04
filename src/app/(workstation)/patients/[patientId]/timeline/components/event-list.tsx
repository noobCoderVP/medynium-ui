import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stagger } from "@/components/shared/stagger";
import { StaggerItem } from "@/components/shared/stagger-item";
import { formatDate } from "@/lib/format";
import type { TimelineEvent } from "@/lib/api/types";
import { EVENT_LABELS, recordHref } from "../lib/event-types";

/** Newest first, on a vertical rail. Each event links to the record behind it, in the tab that shows it. */
export function EventList({ patientId, events }: { patientId: string; events: TimelineEvent[] }) {
  return (
    <Stagger
      role="list"
      className="relative space-y-3 before:absolute before:top-3 before:bottom-3 before:left-[0.4375rem] before:w-px before:bg-border"
    >
      {events.map((event) => (
        <StaggerItem key={event.event_id} role="listitem" className="relative pl-8">
          <span
            aria-hidden="true"
            className="absolute top-5 left-0 size-[0.9375rem] rounded-full border-[3px] border-background bg-primary ring-1 ring-border"
          />
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-sm transition-shadow hover:shadow-md">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                <time dateTime={event.date}>{formatDate(event.date)}</time> ·{" "}
                {EVENT_LABELS[event.type]}
              </p>
              <p className="mt-0.5 font-medium">{event.title}</p>
              {event.summary ? <p className="text-muted-foreground">{event.summary}</p> : null}
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {event.record.table} {event.record.id}
              </p>
            </div>
            <Link
              href={recordHref(patientId, event)}
              className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary hover:underline"
              aria-label={`Open record for ${event.title}`}
            >
              Open record
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
