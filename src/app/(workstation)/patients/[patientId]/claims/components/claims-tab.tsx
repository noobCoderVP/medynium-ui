"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { DateField, FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { StatTile } from "@/components/shared/stat-tile";
import { copy } from "@/lib/copy";
import { formatMoney, formatNumber } from "@/lib/format";
import { useClaims } from "../hooks/use-claims";
import { CLAIM_SORTS, ClaimsTable } from "./claims-table";

const STATUSES = ["SUBMITTED", "APPROVED", "PARTIAL", "DENIED"].map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

export function ClaimsTab({ patientId }: { patientId: string }) {
  const list = useClaims(patientId);
  return (
    <div className="space-y-4">
      <DataState query={list.query} skeleton={<SkeletonRows rows={6} />}>
        {({ utilization: u, claims, total }) => (
          <>
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
            <ListToolbar
              sort={{
                options: CLAIM_SORTS,
                value: list.sort,
                order: list.order,
                onChange: list.setSort,
              }}
              activeCount={list.activeCount}
              onClear={list.clear}
            >
              <FilterField
                label="Status"
                value={list.filters.status}
                onChange={(v) => list.setFilter("status", v)}
                options={STATUSES}
              />
              <DateField
                label="From"
                value={list.filters.from}
                max={list.filters.to || undefined}
                onChange={(v) => list.setFilter("from", v)}
              />
              <DateField
                label="To"
                value={list.filters.to}
                min={list.filters.from || undefined}
                onChange={(v) => list.setFilter("to", v)}
              />
            </ListToolbar>
            {total === 0 ? (
              <EmptyState title={copy.empty.claims} />
            ) : (
              <div className="space-y-3">
                <ClaimsTable
                  claims={claims}
                  highlighted={list.highlighted}
                  sort={{ key: list.sort, order: list.order }}
                  onSort={list.toggleSort}
                />
                <Pagination
                  noun="claims"
                  total={total}
                  offset={list.offset}
                  limit={list.limit}
                  onOffsetChange={list.setOffset}
                  onLimitChange={list.setLimit}
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Source: <span className="font-mono">CLINICAL.CLAIM</span>. The totals above cover the
              whole window, not only the filter.
            </p>
          </>
        )}
      </DataState>
    </div>
  );
}
