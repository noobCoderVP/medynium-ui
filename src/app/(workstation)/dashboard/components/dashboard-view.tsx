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
import { Worklist } from "./worklist";

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
        note={query.data ? `As of ${formatDate(query.data.as_of)}` : "Who needs attention today"}
        actions={<BriefingButton pending={briefing.isPending} onClick={() => briefing.mutate()} />}
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
            <section aria-labelledby="worklist-heading" className="space-y-2">
              <h2 id="worklist-heading" className="text-sm font-semibold">
                Worklist ({data.worklist.length})
              </h2>
              <Worklist items={data.worklist} />
            </section>
            <RecentChanges changes={data.recent_changes} />
          </div>
        )}
      </DataState>
    </>
  );
}
