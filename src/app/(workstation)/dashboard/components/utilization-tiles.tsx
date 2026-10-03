import { StatTile } from "@/components/shared/stat-tile";
import { formatMoney, formatNumber } from "@/lib/format";
import type { Dashboard } from "@/lib/api/types";

/** Utilisation across the caller's patients over the stated window. */
export function UtilizationTiles({ utilization }: { utilization: Dashboard["utilization"] }) {
  return (
    <section aria-labelledby="util-heading" className="space-y-2">
      <h2 id="util-heading" className="text-sm font-semibold">
        Utilisation{utilization.window ? ` · ${utilization.window}` : ""}
      </h2>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Patients" value={formatNumber(utilization.patients)} />
        <StatTile label="Outpatient visits" value={formatNumber(utilization.opd_visits)} />
        <StatTile label="Emergency visits" value={formatNumber(utilization.emergency_visits)} />
        <StatTile label="Hospital stays" value={formatNumber(utilization.hospitalizations)} />
        <StatTile label="Procedures" value={formatNumber(utilization.procedures)} />
        <StatTile label="Approved claims" value={formatMoney(utilization.approved)} />
      </dl>
    </section>
  );
}
