import Link from "next/link";
import { ChangeChip, type ChangeKind } from "@/components/shared/chips";
import type { Overview, TimelineEvent } from "@/lib/api/types";
import { formatShortDate } from "@/lib/format";
import { recordHref } from "../timeline/lib/event-types";

const KIND: Partial<Record<TimelineEvent["type"], ChangeKind>> = {
  MEDICATION_START: "new",
  MEDICATION_CHANGE: "updated",
  LAB_PANEL: "new",
  ENCOUNTER: "new",
};

interface ChangeGroup {
  event: TimelineEvent;
  count: number;
}

/** Identical events on the same day (three "Medication started") collapse into one entry with a count. */
function groupChanges(events: TimelineEvent[]): ChangeGroup[] {
  const groups = new Map<string, ChangeGroup>();
  for (const event of events) {
    const key = `${event.type}|${event.title}|${event.date}`;
    const group = groups.get(key);
    if (group) group.count += 1;
    else groups.set(key, { event, count: 1 });
  }
  return [...groups.values()];
}

/**
 * Under the safety panel: the latest medicine, lab and visit events as a dated list, each opening its record.
 * Built from the overview already loaded, so no extra call.
 */
export function RecentChanges({ patient }: { patient: Overview }) {
  const changes = groupChanges(patient.recent_events.filter((event) => KIND[event.type])).slice(
    0,
    3,
  );
  const base = `/patients/${encodeURIComponent(patient.patient_id)}`;
  return (
    <section
      aria-label="Recent changes"
      className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border bg-surface px-4 py-2"
    >
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Recent changes
      </h2>
      {changes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent changes.</p>
      ) : (
        <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-1.5">
          {changes.map(({ event, count }) => (
            <li key={event.event_id} className="flex min-w-0 items-center gap-2 text-sm">
              <Link
                href={recordHref(patient.patient_id, event)}
                className="text-xs font-medium whitespace-nowrap text-muted-foreground hover:underline"
              >
                {formatShortDate(event.date)}
              </Link>
              <ChangeChip kind={KIND[event.type] ?? "updated"}>
                {count > 1 ? `${event.title} ×${count}` : event.title}
              </ChangeChip>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={`${base}?tab=timeline`}
        className="ml-auto text-xs font-medium text-primary hover:underline"
      >
        View all →
      </Link>
    </section>
  );
}
