import { formatNumber } from "@/lib/format";
import type { Dashboard } from "@/lib/api/types";

/** "last_12_months" or "last 12 months" becomes "Last 12 months". */
function windowLabel(window: string): string {
  const text = window.replaceAll("_", " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-4 py-2.5">
      <dt className="truncate text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-heading text-xl font-bold tracking-tight tabular-nums">{value}</dd>
    </div>
  );
}

/** Utilisation across the caller's patients over the stated window: context, so one compact strip. */
export function UtilizationTiles({ utilization }: { utilization: Dashboard["utilization"] }) {
  return (
    <section aria-labelledby="util-heading" className="space-y-2">
      <h2
        id="util-heading"
        className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
      >
        Utilisation{utilization.window ? ` · ${windowLabel(utilization.window)}` : ""}
      </h2>
      <dl className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-xs md:grid-cols-3 xl:grid-cols-5 xl:divide-y-0 [&>*]:border-border max-xl:[&>*:nth-child(n+3)]:border-t-0">
        <Figure label="Patients" value={formatNumber(utilization.patients)} />
        <Figure label="Outpatient visits" value={formatNumber(utilization.opd_visits)} />
        <Figure label="Emergency visits" value={formatNumber(utilization.emergency_visits)} />
        <Figure label="Hospital stays" value={formatNumber(utilization.hospitalizations)} />
        <Figure label="Procedures" value={formatNumber(utilization.procedures)} />
      </dl>
    </section>
  );
}
