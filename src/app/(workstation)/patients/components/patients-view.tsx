"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { PageHeading } from "@/components/shared/page-heading";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { usePatientList } from "../hooks/use-patients";
import { PATIENT_SORTS, PatientTable } from "./patient-table";

const SEX = [
  { value: "F", label: "Female" },
  { value: "M", label: "Male" },
];
const KIND = [
  { value: "OUTPATIENT", label: "Outpatient visit" },
  { value: "EMERGENCY", label: "Emergency visit" },
  { value: "HOSPITALIZATION", label: "Hospital stay" },
];
const FLAG = [
  { value: "NEW_LAB", label: "New lab results" },
  { value: "NEW_MEDICATION", label: "Medication updated" },
  { value: "RECENT_EMERGENCY", label: "Recent ED visit" },
  { value: "NEW_DOCUMENT", label: "New document" },
];

export function PatientsView() {
  const list = usePatientList();
  const { query } = list;

  return (
    <div className="space-y-4">
      <PageHeading
        title="Patients"
        note="Find and review patients in your care. Only patients you are assigned to appear here."
      />
      <ListToolbar
        search={{
          value: list.text,
          onChange: list.setText,
          label: "Search name, id or condition",
        }}
        sort={{
          options: PATIENT_SORTS,
          value: list.sort,
          order: list.order,
          onChange: list.setSort,
        }}
        activeCount={list.activeCount}
        onClear={list.clear}
      >
        <FilterField
          label="Sex"
          value={list.filters.sex}
          onChange={(v) => list.setFilter("sex", v)}
          options={SEX}
        />
        <FilterField
          label="Last encounter"
          value={list.filters.kind}
          onChange={(v) => list.setFilter("kind", v)}
          options={KIND}
        />
        <FilterField
          label="Change"
          value={list.filters.flag}
          onChange={(v) => list.setFilter("flag", v)}
          options={FLAG}
        />
        <label className="flex min-h-9 cursor-pointer items-center gap-2 self-end text-sm">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={list.filters.changed === "1"}
            onChange={(e) => list.setFilter("changed", e.target.checked ? "1" : "")}
          />
          Only with changes
        </label>
      </ListToolbar>
      <DataState
        query={query}
        skeleton={<SkeletonRows rows={8} />}
        isEmpty={(page) => page.total === 0}
        empty={<EmptyState title={copy.empty.patients} />}
      >
        {(page) => (
          <div className="space-y-3">
            <PatientTable
              items={page.items}
              sort={{ key: list.sort, order: list.order }}
              onSort={list.toggleSort}
            />
            <Pagination
              noun="patients"
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
