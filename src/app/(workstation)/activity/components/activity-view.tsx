"use client";

import { DataState } from "@/components/shared/data-state";
import { DateField, FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { PageHeading } from "@/components/shared/page-heading";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { useAudit } from "../hooks/use-audit";
import { ACTIONS, OUTCOMES, humanize } from "../lib/labels";
import { AiMetricsCard } from "./ai-metrics-card";
import { AUDIT_SORTS, AuditTable } from "./audit-table";

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value, label: humanize(value) }));

export function ActivityView() {
  const audit = useAudit();
  const { from, to } = audit.filters;
  return (
    <div data-fit className="flex flex-col gap-4 lg:min-h-0 lg:flex-1">
      <PageHeading
        title="Activity log"
        note="What you and the assistant did on your behalf. Only your own entries appear."
      />
      <AiMetricsCard />
      <ListToolbar
        search={{
          value: audit.text,
          onChange: audit.setText,
          label: "Search question, patient or answer id",
        }}
        sort={{
          options: AUDIT_SORTS,
          value: audit.sort,
          order: audit.order,
          onChange: audit.setSort,
        }}
        activeCount={audit.activeCount}
        onClear={audit.clear}
      >
        <FilterField
          label="Action"
          value={audit.filters.action}
          onChange={(v) => audit.setFilter("action", v)}
          options={toOptions(ACTIONS)}
          anyLabel="Any action"
        />
        <FilterField
          label="Outcome"
          value={audit.filters.outcome}
          onChange={(v) => audit.setFilter("outcome", v)}
          options={toOptions(OUTCOMES)}
          anyLabel="Any outcome"
        />
        <DateField
          label="From"
          value={from}
          max={to || undefined}
          onChange={(v) => audit.setFilter("from", v)}
        />
        <DateField
          label="To"
          value={to}
          min={from || undefined}
          onChange={(v) => audit.setFilter("to", v)}
        />
      </ListToolbar>
      <DataState
        query={audit.query}
        isEmpty={(page) => page.total === 0}
        empty={<EmptyState title={copy.empty.audit} />}
      >
        {(page) => (
          <div className="flex min-h-0 flex-col gap-3 lg:flex-1">
            <div className="min-h-0">
              <AuditTable
                items={page.items}
                sort={{ key: audit.sort, order: audit.order }}
                onSort={audit.toggleSort}
              />
            </div>
            <Pagination
              noun="entries"
              total={page.total}
              offset={audit.offset}
              limit={audit.limit}
              onOffsetChange={audit.setOffset}
              onLimitChange={audit.setLimit}
            />
          </div>
        )}
      </DataState>
    </div>
  );
}
