"use client";

import { TableSkeleton } from "@/components/shared/skeletons";
import { DataState } from "@/components/shared/data-state";
import { DateField, FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { TablePanel } from "@/components/shared/table-panel";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { StatGroup } from "@/components/shared/stat-group";
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
    <div className="flex flex-col gap-4 lg:min-h-0 lg:flex-1">
      <DataState query={list.query} skeleton={<TableSkeleton />}>
        {({ utilization: u, claims, total }) => (
          <>
            <div className="grid gap-3 md:grid-cols-[3fr_2fr]">
              <StatGroup
                title={`Utilization${u.window ? ` · ${u.window}` : ""}`}
                items={[
                  ["Outpatient", formatNumber(u.opd_visits)],
                  ["Emergency", formatNumber(u.emergency_visits)],
                  ["Hospital stays", formatNumber(u.hospitalizations)],
                  ["Procedures", formatNumber(u.procedures)],
                ]}
              />
              <StatGroup
                title="Financial"
                items={[
                  ["Billed", formatMoney(u.billed)],
                  ["Approved", formatMoney(u.approved)],
                ]}
              />
            </div>
            <TablePanel
              toolbar={
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
              }
              footer={
                total === 0 ? undefined : (
                  <Pagination
                    noun="claims"
                    total={total}
                    offset={list.offset}
                    limit={list.limit}
                    onOffsetChange={list.setOffset}
                    onLimitChange={list.setLimit}
                  />
                )
              }
            >
              {total === 0 ? (
                <EmptyState title={copy.empty.claims} />
              ) : (
                <ClaimsTable
                  claims={claims}
                  highlighted={list.highlighted}
                  sort={{ key: list.sort, order: list.order }}
                  onSort={list.toggleSort}
                />
              )}
            </TablePanel>
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
