import { ArrowRight } from "lucide-react";
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

/**
 * Directly under the patient header: what needs attention (labs outside their reference range) and what changed
 * (the latest medicine, lab and visit events), each opening its record, plus a way into the safety review. Built
 * from the overview already loaded, so no extra call.
 */
export function RecentChanges({ patient }: { patient: Overview }) {
  const changes = patient.recent_events.filter((event) => KIND[event.type]).slice(0, 3);
  const abnormal = patient.latest_labs
    .filter((lab) => lab.flag === "HIGH" || lab.flag === "LOW")
    .slice(0, 3);
  if (changes.length === 0 && abnormal.length === 0) return null;
  const base = `/patients/${encodeURIComponent(patient.patient_id)}`;
  return (
    <section
      aria-label="Recent changes"
      className="space-y-2 border-t border-border bg-muted/50 px-4 py-3"
    >
      {abnormal.length > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Needs attention
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
          </ul>
        </div>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          What changed
        </h2>
        <ul className="flex flex-1 flex-wrap gap-x-4 gap-y-1">
          {changes.map((event) => (
            <li key={event.event_id} className="flex min-w-0 items-center gap-2 text-sm">
              <ChangeChip kind={KIND[event.type] ?? "updated"}>{event.title}</ChangeChip>
              <Link href={recordHref(patient.patient_id, event)} className={linkClass}>
                {formatDate(event.date)}
              </Link>
            </li>
          ))}
          {changes.length === 0 ? (
            <li className="text-sm text-muted-foreground">No recent changes.</li>
          ) : null}
        </ul>
        <Link
          href={`${base}?tab=safety`}
          className="inline-flex min-h-8 items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Review safety
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
