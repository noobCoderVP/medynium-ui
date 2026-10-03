"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import { formatNumber } from "@/lib/format";
import { PAGE_SIZE, usePatientList } from "../hooks/use-patients";
import { PatientTable } from "./patient-table";

export function PatientsView() {
  const { query, text, setText, changed, offset, setChanged, setOffset } = usePatientList();
  const total = query.data?.total ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <>
      <PageHeading title="Patients" note="Only patients you are assigned to appear here." />
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <label htmlFor="patient-filter" className="sr-only">
            Search patients by name, id or condition
          </label>
          <Search
            className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="patient-filter"
            className="pl-8"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Name, id or condition"
            autoComplete="off"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={changed}
            onChange={(e) => setChanged(e.target.checked)}
          />
          Only patients with changes
        </label>
      </div>
      <DataState
        query={query}
        skeleton={<SkeletonRows rows={8} />}
        isEmpty={(page) => page.items.length === 0}
        empty={<EmptyState title={copy.empty.patients} />}
      >
        {(page) => (
          <div className="space-y-3">
            <PatientTable items={page.items} />
            <nav aria-label="Pages" className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground" aria-live="polite">
                {formatNumber(from)} to {formatNumber(to)} of {formatNumber(total)}
              </span>
              <span className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                >
                  <ChevronLeft aria-hidden="true" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={to >= total}
                  onClick={() => setOffset(offset + PAGE_SIZE)}
                >
                  Next
                  <ChevronRight aria-hidden="true" />
                </Button>
              </span>
            </nav>
          </div>
        )}
      </DataState>
    </>
  );
}
