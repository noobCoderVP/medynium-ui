"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { Select } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import { useMedications } from "../hooks/use-medications";
import { MedicationsTable } from "./medications-table";

export function MedicationsTab({ patientId }: { patientId: string }) {
  const { query, status, setStatus } = useMedications(patientId);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label htmlFor="med-status" className="text-sm font-medium">
          Show
        </label>
        <Select
          id="med-status"
          className="w-44"
          value={status}
          onChange={(e) => setStatus(e.target.value === "all" ? "all" : "active")}
        >
          <option value="active">Current medicines</option>
          <option value="all">Current and past</option>
        </Select>
      </div>
      <DataState
        query={query}
        skeleton={<SkeletonRows rows={5} />}
        isEmpty={(rows) => rows.length === 0}
        empty={<EmptyState title={copy.empty.medications} />}
      >
        {(rows) => <MedicationsTable rows={rows} />}
      </DataState>
    </div>
  );
}
