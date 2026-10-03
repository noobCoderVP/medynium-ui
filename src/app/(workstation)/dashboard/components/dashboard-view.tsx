"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { useBriefing } from "../hooks/use-briefing";
import { useDashboard } from "../hooks/use-dashboard";
import { BriefingButton } from "./briefing-button";
import { BriefingCard } from "./briefing-card";
import { RecentChanges } from "./recent-changes";
import { UtilizationTiles } from "./utilization-tiles";
import { countUrgent, Worklist } from "./worklist";

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <SkeletonRows rows={6} />
    </div>
  );
}

export function DashboardView() {
  const query = useDashboard();
  const briefing = useBriefing();
  return (
    <>
      <PageHeading
        title="Dashboard"
        note={
          query.data ? `Data updated ${formatDate(query.data.as_of)}` : "Who needs attention today"
        }
      />
      <BriefingCard
        briefing={briefing.data}
        error={briefing.error}
        onClose={() => briefing.reset()}
        onRetry={() => briefing.mutate()}
      />
      <DataState query={query} skeleton={<DashboardSkeleton />}>
        {(data) => (
          <div className="space-y-6">
            <UtilizationTiles utilization={data.utilization} />
            <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <section aria-labelledby="worklist-heading" className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id="worklist-heading" className="text-lg font-semibold tracking-tight">
                      Patients needing attention · {data.worklist.length}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {countUrgent(data.worklist)} with a recent emergency visit, most urgent first
                    </p>
                  </div>
                  <BriefingButton pending={briefing.isPending} onClick={() => briefing.mutate()} />
                </div>
                <Worklist items={data.worklist} />
              </section>
              <RecentChanges changes={data.recent_changes} />
            </div>
          </div>
        )}
      </DataState>
    </>
  );
}
