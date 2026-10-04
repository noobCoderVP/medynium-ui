import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DoctorLine } from "@/components/shared/doctor-line";
import { Stagger } from "@/components/shared/stagger";
import { StaggerItem } from "@/components/shared/stagger-item";
import { formatDate } from "@/lib/format";
import type { TimelineEvent } from "@/lib/api/types";
import { EVENT_LABELS, recordHref } from "@/lib/event-types";

/** Consecutive events on the same day share one date heading, so the day is read once, not per event. */
function groupByDate(events: TimelineEvent[]): { date: string; events: TimelineEvent[] }[] {
  const groups: { date: string; events: TimelineEvent[] }[] = [];
  for (const event of events) {
    const last = groups[groups.length - 1];
    if (last?.date === event.date) last.events.push(event);
    else groups.push({ date: event.date, events: [event] });
  }
  return groups;
}

/**
 * Newest first and date-first: a bold date heading per day, then compact events (type, title, summary, record link)
 * on a rail. Each event links to the record behind it, in the tab that shows it.
 */
export function EventList({ patientId, events }: { patientId: string; events: TimelineEvent[] }) {
  return (
    <div className="space-y-5">
      {groupByDate(events).map((group) => (
        <section key={group.date} aria-label={formatDate(group.date)}>
          <h3 className="mb-2 flex items-center gap-3 text-sm font-bold tracking-wide text-heading uppercase">
            <time dateTime={group.date}>{formatDate(group.date)}</time>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </h3>
          <Stagger
            role="list"
            className="relative space-y-1.5 before:absolute before:top-2 before:bottom-2 before:left-[0.4375rem] before:w-px before:bg-border"
          >
            {group.events.map((event) => (
              <StaggerItem key={event.event_id} role="listitem" className="relative pl-8">
                <span
                  aria-hidden="true"
                  className="absolute top-3.5 left-0 size-[0.9375rem] rounded-full border-[3px] border-surface bg-primary ring-1 ring-border"
                />
                <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-accent/30">
                  <div className="min-w-0">
                    <p className="font-medium">{event.title}</p>
                    {event.summary ? (
                      <p className="truncate text-muted-foreground">{event.summary}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {EVENT_LABELS[event.type]} ·{" "}
                      <span className="font-mono">
                        {event.record.table} {event.record.id}
                      </span>
                    </p>
                    <DoctorLine doctor={event.doctor} className="mt-0.5" />
                  </div>
                  <Link
                    href={recordHref(patientId, event)}
                    className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary hover:underline"
                    aria-label={`Open record for ${event.title}`}
                  >
                    Open
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ))}
    </div>
  );
}
