"use client";

import { CorpusStatusCard } from "@/components/shared/corpus-status-card";
import { DataState } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOverview } from "../hooks/use-admin-overview";
import { GoldenReportCard } from "./golden-report-card";
import { HealthCard } from "./health-card";

export function AdminLanding() {
  const { health, corpus, golden } = useAdminOverview();
  return (
    <>
      <PageHeading
        title="Admin"
        note="Platform health, the knowledge corpus and the quality report."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <DataState query={health} skeleton={<Skeleton className="h-56" />}>
          {(data) => <HealthCard health={data} />}
        </DataState>
        <DataState query={corpus} skeleton={<Skeleton className="h-56" />}>
          {(data) => <CorpusStatusCard status={data} />}
        </DataState>
      </div>
      <DataState query={golden} skeleton={<Skeleton className="h-40" />}>
        {(data) => <GoldenReportCard runs={data} />}
      </DataState>
    </>
  );
}
