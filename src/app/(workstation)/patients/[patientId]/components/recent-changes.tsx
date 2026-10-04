import { ArrowRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { ChangeChip, type ChangeKind } from "@/components/shared/chips";
import type { Overview, TimelineEvent } from "@/lib/api/types";
import { formatDate, formatValue } from "@/lib/format";
import { recordHref } from "../timeline/lib/event-types";

const KIND: Partial<Record<TimelineEvent["type"], ChangeKind>> = {
  MEDICATION_START: "new",
  MEDICATION_CHANGE: "updated",
  LAB_PANEL: "new",
  ENCOUNTER: "new",
};

const linkClass = "text-xs text-muted-foreground underline-offset-2 hover:underline";
const headingClass = "text-xs font-semibold tracking-wide uppercase";

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
 * Directly under the patient header: what needs attention (labs outside their reference range) and what changed
 * (the latest medicine, lab and visit events), each opening its record. "Review safety" sits on the attention row
 * because it is the action for it. Built from the overview already loaded, so no extra call.
 */
export function RecentChanges({ patient }: { patient: Overview }) {
  const changes = groupChanges(patient.recent_events.filter((event) => KIND[event.type])).slice(
    0,
    3,
  );
  const allAbnormal = patient.latest_labs.filter(
    (lab) => lab.flag === "HIGH" || lab.flag === "LOW",
  );
  const abnormal = allAbnormal.slice(0, 3);
  if (changes.length === 0 && abnormal.length === 0) return null;
  const base = `/patients/${encodeURIComponent(patient.patient_id)}`;
  const safety = (
    <Link
      href={`${base}?tab=safety`}
      className="inline-flex min-h-8 items-center gap-1 rounded-md border border-primary/30 bg-card px-2.5 text-sm font-medium text-primary hover:bg-accent"
    >
      Review safety
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
  return (
    <section aria-label="Recent changes" className="border-t border-border">
      {abnormal.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-crit/20 bg-crit-soft/60 px-4 py-2.5">
          <h2 className={`${headingClass} inline-flex items-center gap-1.5 text-crit`}>
            <TriangleAlert className="size-3.5" aria-hidden="true" />
            Needs attention · {allAbnormal.length}
          </h2>
          <ul className="flex flex-1 flex-wrap gap-x-4 gap-y-1">
            {abnormal.map((lab) => (
              <li key={lab.lab_id} className="flex items-center gap-2">
                <ChangeChip kind="review">
                  {`${lab.test} ${formatValue(lab.value, lab.unit)} (${lab.flag?.toLowerCase()})`}
                </ChangeChip>
                <Link href={`${base}?tab=labs`} className={linkClass}>
                  {formatDate(lab.date)}
                </Link>
              </li>
            ))}
            {allAbnormal.length > abnormal.length ? (
              <li>
                <Link href={`${base}?tab=labs&flag=abnormal`} className={linkClass}>
                  +{allAbnormal.length - abnormal.length} more
                </Link>
              </li>
            ) : null}
          </ul>
          {safety}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-muted/50 px-4 py-2.5">
        <h2 className={`${headingClass} text-muted-foreground`}>What changed</h2>
        <ul className="flex flex-1 flex-wrap gap-x-4 gap-y-1">
          {changes.map(({ event, count }) => (
            <li key={event.event_id} className="flex min-w-0 items-center gap-2 text-sm">
              <ChangeChip kind={KIND[event.type] ?? "updated"}>
                {count > 1 ? `${event.title} ×${count}` : event.title}
              </ChangeChip>
              <Link href={recordHref(patient.patient_id, event)} className={linkClass}>
                {formatDate(event.date)}
              </Link>
            </li>
          ))}
          {changes.length === 0 ? (
            <li className="text-sm text-muted-foreground">No recent changes.</li>
          ) : null}
        </ul>
        {abnormal.length === 0 ? safety : null}
      </div>
    </section>
  );
}
