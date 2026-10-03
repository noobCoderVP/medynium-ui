"use client";

import { X } from "lucide-react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { copy } from "@/lib/copy";
import { useLabs } from "../hooks/use-labs";
import { LabTrendChart } from "./lab-trend-chart";
import { LabsTable } from "./labs-table";

export function LabsTab({ patientId }: { patientId: string }) {
  const { list, trend, code, select } = useLabs(patientId);
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
      <DataState
        query={list}
        skeleton={<SkeletonRows rows={6} />}
        isEmpty={(rows) => rows.length === 0}
        empty={<EmptyState title={copy.empty.labs} />}
      >
        {(rows) => (
          <div className="space-y-2">
            <LabsTable rows={rows} selected={code} onSelect={select} />
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
