"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { StatTile } from "@/components/shared/stat-tile";
import { copy } from "@/lib/copy";
import { formatMoney, formatNumber } from "@/lib/format";
import { useClaims } from "../hooks/use-claims";
import { ClaimsTable } from "./claims-table";

export function ClaimsTab({ patientId }: { patientId: string }) {
  const { query, highlighted } = useClaims(patientId);
  return (
    <DataState query={query} skeleton={<SkeletonRows rows={6} />}>
      {({ utilization: u, claims }) => (
        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <StatTile
              label="Outpatient visits"
              value={formatNumber(u.opd_visits)}
              note={u.window}
            />
            <StatTile label="Emergency visits" value={formatNumber(u.emergency_visits)} />
            <StatTile label="Hospital stays" value={formatNumber(u.hospitalizations)} />
            <StatTile label="Procedures" value={formatNumber(u.procedures)} />
            <StatTile label="Billed" value={formatMoney(u.billed)} />
            <StatTile label="Approved" value={formatMoney(u.approved)} />
          </dl>
          {claims.length === 0 ? (
            <EmptyState title={copy.empty.claims} />
          ) : (
            <ClaimsTable claims={claims} highlighted={highlighted} />
          )}
          <p className="text-xs text-muted-foreground">
            Source: <span className="font-mono">CLINICAL.CLAIM</span>.
          </p>
        </div>
      )}
    </DataState>
  );
}
