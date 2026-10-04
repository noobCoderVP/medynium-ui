import { ArrowRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { Overview } from "@/lib/api/types";
import { formatShortDate, formatValue } from "@/lib/format";
import { abnormalLabs, labDelta, refRange } from "@/lib/abnormal-labs";

const MAX_ROWS = 4;

/**
 * The clinical safety panel: every lab outside its reference range with its movement and a plain reason, plus the
 * way into the safety review. The reasons come only from recorded values (range and previous result), never from
 * a model. Renders nothing when no result is flagged.
 */
export function AttentionPanel({ patient }: { patient: Overview }) {
  const all = abnormalLabs(patient.latest_labs);
  if (all.length === 0) return null;
  const rows = all.slice(0, MAX_ROWS);
  const base = `/patients/${encodeURIComponent(patient.patient_id)}`;
  return (
    <section
      aria-label="Needs attention"
      className="border-t border-crit/30 bg-crit-soft/70 px-4 py-2.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-crit uppercase">
          <TriangleAlert className="size-4" aria-hidden="true" />
          {all.length} {all.length === 1 ? "item needs" : "items need"} attention
        </h2>
        <Link
          href={`${base}?tab=safety`}
          className="inline-flex min-h-8 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          Review safety
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-2 divide-y divide-crit/15 rounded-lg border border-crit/20 bg-card">
        {rows.map((lab) => {
          const delta = labDelta(lab);
          const range = refRange(lab);
          return (
            <li
              key={lab.lab_id}
              className="grid gap-x-4 px-3 py-1 text-sm sm:grid-cols-[minmax(0,10rem)_auto_1fr] sm:items-baseline"
            >
              <Link
                href={`${base}?tab=labs&lab=${encodeURIComponent(lab.code)}`}
                className="font-semibold text-primary hover:underline"
              >
                {lab.test}
              </Link>
              <span className="font-semibold text-crit tabular-nums">
                {formatValue(lab.value, lab.unit)} {lab.flag === "HIGH" ? "↑ High" : "↓ Low"}
                {delta ? <span className="sr-only"> ({delta.text} vs previous)</span> : null}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatShortDate(lab.date)}
                {range ? ` · Ref ${range}` : ""}
                {lab.previous
                  ? ` · ${delta?.arrow === "↓" ? "↓" : delta?.arrow === "↑" ? "↑" : "→"} from ${formatValue(lab.previous.value)}`
                  : ""}
              </span>
            </li>
          );
        })}
      </ul>
      {all.length > rows.length ? (
        <Link
          href={`${base}?tab=labs&flag=abnormal`}
          className="mt-1.5 inline-block text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          +{all.length - rows.length} more
        </Link>
      ) : null}
    </section>
  );
}
