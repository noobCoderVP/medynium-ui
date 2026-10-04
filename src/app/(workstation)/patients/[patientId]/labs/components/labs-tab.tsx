"use client";

import { X } from "lucide-react";
import { TableSkeleton } from "@/components/shared/skeletons";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { Pagination } from "@/components/shared/pagination";
import { TablePanel } from "@/components/shared/table-panel";
import { EmptyState } from "@/components/shared/state-panels";
import { AskButton } from "@/features/agent-panel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import type { LabLatest } from "@/lib/api/types";
import { copy } from "@/lib/copy";
import { useLabs } from "../hooks/use-labs";
import { LabTrendChart } from "./lab-trend-chart";
import { summarize } from "../lib/summary";
import { LabsTable } from "./labs-table";
import { LabsToolbar } from "./labs-toolbar";

/** "7 results · 4 abnormal · 2 trending up". Counts cover the rows in hand, so a paged list says so. */
function LabsSummary({ rows, total }: { rows: LabLatest[]; total: number }) {
  const { abnormal, rising } = summarize(rows);
  const scope = rows.length < total ? " on this page" : "";
  return (
    <p className="text-sm font-medium text-muted-foreground" aria-live="polite">
      {total} {total === 1 ? "result" : "results"}
      <span aria-hidden="true"> · </span>
      <span className={abnormal > 0 ? "font-semibold text-crit" : undefined}>
        {abnormal} abnormal{scope}
      </span>
      <span aria-hidden="true"> · </span>
      {rising} trending up{scope}
    </p>
  );
}

export function LabsTab({ patientId }: { patientId: string }) {
  const labs = useLabs(patientId);
  const { list, trend, code, select } = labs;
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:min-h-0 lg:flex-1",
        code && "xl:grid xl:grid-cols-[minmax(0,1fr)_26rem]",
      )}
    >
      <div data-fit className="flex flex-col gap-3 lg:min-h-0">
        <LabsToolbar
          text={labs.text}
          onText={labs.setText}
          flag={labs.filters.flag}
          onFlag={(v) => labs.setFilter("flag", v)}
          sort={labs.sort}
          order={labs.order}
          onSort={labs.setSort}
          activeCount={labs.activeCount}
          onClear={labs.clear}
        />
        <DataState
          query={list}
          skeleton={<TableSkeleton />}
          isEmpty={(page) => page.total === 0}
          empty={<EmptyState title={copy.empty.labs} />}
        >
          {(page) => (
            <TablePanel
              summary={<LabsSummary rows={page.items} total={page.total} />}
              footer={
                <>
                  <Pagination
                    noun="tests"
                    total={page.total}
                    offset={labs.offset}
                    limit={labs.limit}
                    onOffsetChange={labs.setOffset}
                    onLimitChange={labs.setLimit}
                  />
                  <p className="text-xs text-muted-foreground">
                    Source: <span className="font-mono">CLINICAL.LAB_RESULT</span>. Choose a test
                    name to see its trend.
                  </p>
                </>
              }
            >
              <LabsTable
                rows={page.items}
                selected={code}
                onSelect={select}
                sort={{ key: labs.sort, order: labs.order }}
                onSort={labs.toggleSort}
              />
            </TablePanel>
          )}
        </DataState>
      </div>
      {code ? (
        <Card className="xl:self-start">
          <CardHeader>
            <CardTitle>Trend</CardTitle>
            <div className="flex items-center gap-1">
              <AskButton
                label="Explain trend"
                question={`Explain the trend in this patient's ${trend.data?.test ?? "selected lab"} results.`}
              />
              <Button variant="ghost" size="sm" onClick={() => select(null)}>
                <X aria-hidden="true" />
                Close
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <DataState query={trend} skeleton={<SkeletonRows rows={4} />}>
              {(data) => <LabTrendChart trend={data} />}
            </DataState>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
