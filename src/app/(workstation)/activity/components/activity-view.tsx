"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { DateField, FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { PageHeading } from "@/components/shared/page-heading";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { useAudit } from "../hooks/use-audit";
import { ACTIONS, OUTCOMES, humanize } from "../lib/labels";
import { AUDIT_SORTS, AuditTable } from "./audit-table";

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value, label: humanize(value) }));

export function ActivityView() {
  const audit = useAudit();
  const { from, to } = audit.filters;
  return (
    <div className="space-y-4">
      <PageHeading
        title="Activity log"
        note="What you and the assistant did on your behalf. Only your own entries appear."
      />
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
        skeleton={<SkeletonRows rows={6} />}
        isEmpty={(page) => page.total === 0}
        empty={<EmptyState title={copy.empty.audit} />}
      >
        {(page) => (
          <div className="space-y-3">
            <AuditTable
              items={page.items}
              sort={{ key: audit.sort, order: audit.order }}
              onSort={audit.toggleSort}
            />
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
