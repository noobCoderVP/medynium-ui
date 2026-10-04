"use client";

import { TableSkeleton } from "@/components/shared/skeletons";
import { DataState } from "@/components/shared/data-state";
import { FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { TablePanel } from "@/components/shared/table-panel";
import { EmptyState } from "@/components/shared/state-panels";
import { useIsDoctor } from "@/features/session";
import { copy } from "@/lib/copy";
import { useMedications } from "../hooks/use-medications";
import { AddMedicationDialog } from "./add-medication-dialog";
import { MEDICATION_SORTS, MedicationsTable } from "./medications-table";

export function MedicationsTab({ patientId }: { patientId: string }) {
  const list = useMedications(patientId);
  const isDoctor = useIsDoctor();
  return (
    <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      {isDoctor ? (
        <div className="flex justify-end">
          <AddMedicationDialog patientId={patientId} />
        </div>
      ) : null}
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
        skeleton={<TableSkeleton />}
        isEmpty={(page) => page.total === 0}
        empty={<EmptyState title={copy.empty.medications} />}
      >
        {(page) => (
          <TablePanel
            footer={
              <>
                <Pagination
                  noun="medicines"
                  total={page.total}
                  offset={list.offset}
                  limit={list.limit}
                  onOffsetChange={list.setOffset}
                  onLimitChange={list.setLimit}
                />
                <p className="text-xs text-muted-foreground">
                  Source: <span className="font-mono">CLINICAL.MEDICATION</span>. &quot;Not
                  indexed&quot; means the safety review has no label text for that medicine and will
                  say so.
                </p>
              </>
            }
          >
            <MedicationsTable
              rows={page.items}
              sort={{ key: list.sort, order: list.order }}
              onSort={list.toggleSort}
            />
          </TablePanel>
        )}
      </DataState>
    </div>
  );
}
