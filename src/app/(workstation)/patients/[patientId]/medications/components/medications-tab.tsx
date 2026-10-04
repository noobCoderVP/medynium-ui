"use client";

import { DataState } from "@/components/shared/data-state";
import { FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { useMedications } from "../hooks/use-medications";
import { AddMedicationDialog } from "./add-medication-dialog";
import { MEDICATION_SORTS, MedicationsTable } from "./medications-table";

export function MedicationsTab({ patientId }: { patientId: string }) {
  const list = useMedications(patientId);
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AddMedicationDialog patientId={patientId} />
      </div>
      <ListToolbar
        search={{ value: list.text, onChange: list.setText, label: "Search medicines" }}
        sort={{
          options: MEDICATION_SORTS,
          value: list.sort,
          order: list.order,
          onChange: list.setSort,
        }}
        activeCount={list.activeCount}
        onClear={list.clear}
      >
        <FilterField
          label="Show"
          value={list.filters.status}
          onChange={(v) => list.setFilter("status", v)}
          anyLabel="Current medicines"
          options={[{ value: "all", label: "Current and past" }]}
        />
      </ListToolbar>
      <DataState
        query={list.query}
        isEmpty={(page) => page.total === 0}
        empty={<EmptyState title={copy.empty.medications} />}
      >
        {(page) => (
          <div className="space-y-3">
            <MedicationsTable
              rows={page.items}
              sort={{ key: list.sort, order: list.order }}
              onSort={list.toggleSort}
            />
            <Pagination
              noun="medicines"
              total={page.total}
              offset={list.offset}
              limit={list.limit}
              onOffsetChange={list.setOffset}
              onLimitChange={list.setLimit}
            />
          </div>
        )}
      </DataState>
    </div>
  );
}
