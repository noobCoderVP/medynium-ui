"use client";

import { X } from "lucide-react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { copy } from "@/lib/copy";
import { useLabs } from "../hooks/use-labs";
import { LabTrendChart } from "./lab-trend-chart";
import { LAB_SORTS, LabsTable } from "./labs-table";

const FLAGS = [
  { value: "abnormal", label: "Abnormal (low or high)" },
  { value: "LOW", label: "Low" },
  { value: "HIGH", label: "High" },
  { value: "NORMAL", label: "Normal" },
];

export function LabsTab({ patientId }: { patientId: string }) {
  const labs = useLabs(patientId);
  const { list, trend, code, select } = labs;
  return (
    <div className="space-y-4">
      {code ? (
        <Card>
          <CardHeader>
            <CardTitle>Trend</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => select(null)}>
              <X aria-hidden="true" />
              Close trend
            </Button>
          </CardHeader>
          <CardBody>
            <DataState query={trend} skeleton={<SkeletonRows rows={4} />}>
              {(data) => <LabTrendChart trend={data} />}
            </DataState>
          </CardBody>
        </Card>
      ) : null}
      <ListToolbar
        search={{ value: labs.text, onChange: labs.setText, label: "Search tests" }}
        sort={{
          options: LAB_SORTS,
          value: labs.sort,
          order: labs.order,
          onChange: labs.setSort,
        }}
        activeCount={labs.activeCount}
        onClear={labs.clear}
      >
        <FilterField
          label="Flag"
          value={labs.filters.flag}
          onChange={(v) => labs.setFilter("flag", v)}
          options={FLAGS}
        />
      </ListToolbar>
      <DataState
        query={list}
        skeleton={<SkeletonRows rows={6} />}
        isEmpty={(page) => page.total === 0}
        empty={<EmptyState title={copy.empty.labs} />}
      >
        {(page) => (
          <div className="space-y-3">
            <LabsTable
              rows={page.items}
              selected={code}
              onSelect={select}
              sort={{ key: labs.sort, order: labs.order }}
              onSort={labs.toggleSort}
            />
            <Pagination
              noun="tests"
              total={page.total}
              offset={labs.offset}
              limit={labs.limit}
              onOffsetChange={labs.setOffset}
              onLimitChange={labs.setLimit}
            />
            <p className="text-xs text-muted-foreground">
              Source: <span className="font-mono">CLINICAL.LAB_RESULT</span>. Choose a test name to
              see its trend.
            </p>
          </div>
        )}
      </DataState>
    </div>
  );
}
