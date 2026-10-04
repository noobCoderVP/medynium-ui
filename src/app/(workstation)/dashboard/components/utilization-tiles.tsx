import { formatNumber } from "@/lib/format";
import type { Dashboard } from "@/lib/api/types";

/** "last_12_months" or "last 12 months" becomes "Last 12 months". */
function windowLabel(window: string): string {
  const text = window.replaceAll("_", " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-baseline gap-2 px-4 py-2">
      <dd className="font-heading text-lg font-bold tracking-tight tabular-nums">{value}</dd>
      <dt className="truncate text-xs font-medium text-muted-foreground">{label}</dt>
    </div>
  );
}

/** Utilisation across the caller's patients over the stated window: context, so one slim strip. */
export function UtilizationTiles({ utilization }: { utilization: Dashboard["utilization"] }) {
  return (
    <section
      aria-label={`Utilisation${utilization.window ? ` · ${windowLabel(utilization.window)}` : ""}`}
      className="flex flex-wrap items-center gap-x-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      {utilization.window ? (
        <p className="border-r border-border px-4 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase max-sm:w-full max-sm:border-r-0 max-sm:border-b">
          {windowLabel(utilization.window)}
        </p>
      ) : null}
      <dl className="grid min-w-0 flex-1 grid-cols-2 divide-x divide-border sm:grid-cols-3 xl:grid-cols-5 [&>*]:border-border">
        <Figure label="Patients" value={formatNumber(utilization.patients)} />
        <Figure label="Outpatient" value={formatNumber(utilization.opd_visits)} />
        <Figure label="Emergency" value={formatNumber(utilization.emergency_visits)} />
        <Figure label="Stays" value={formatNumber(utilization.hospitalizations)} />
        <Figure label="Procedures" value={formatNumber(utilization.procedures)} />
      </dl>
    </section>
  );
}
