"use client";

import { DataState } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { formatDate } from "@/lib/format";
import { useBriefing } from "../hooks/use-briefing";
import { useDashboard } from "../hooks/use-dashboard";
import { BriefingButton } from "./briefing-button";
import { BriefingCard } from "./briefing-card";
import { RecentChanges } from "./recent-changes";
import { UtilizationTiles } from "./utilization-tiles";
import { Worklist } from "./worklist";
import { attentionReasons } from "../lib/priority";
import type { Dashboard } from "@/lib/api/types";

/** "Why these patients": the counts behind the list, in plain words. */
function describeReasons(data: Dashboard): string {
  const r = attentionReasons(data);
  const parts = [
    r.emergencies &&
      `${r.emergencies} recent emergency ${r.emergencies === 1 ? "visit" : "visits"}`,
    r.abnormalLabs && `${r.abnormalLabs} abnormal ${r.abnormalLabs === 1 ? "lab" : "labs"}`,
    r.medicationChanges &&
      `${r.medicationChanges} medication ${r.medicationChanges === 1 ? "change" : "changes"}`,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "No new changes";
}

export function DashboardView() {
  const query = useDashboard();
  const briefing = useBriefing();
  return (
    <div data-fit className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      <PageHeading
        title="Clinical overview"
        note={
          query.data
            ? `Data updated ${formatDate(query.data.as_of)}`
            : "Who needs attention today, why, and what changed"
        }
      />
      <BriefingCard
        briefing={briefing.data}
        error={briefing.error}
        onClose={() => briefing.reset()}
        onRetry={() => briefing.mutate()}
      />
      <DataState query={query}>
        {(data) => (
          <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
            <UtilizationTiles utilization={data.utilization} />
            <div className="grid gap-3 lg:min-h-[26rem] lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:grid-rows-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(16rem,19rem)_minmax(16rem,19rem)]">
              <section
                aria-labelledby="worklist-heading"
                className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
                  <div>
                    <h2 id="worklist-heading">
                      Patients needing attention · {data.worklist.length}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {describeReasons(data)} · most urgent first
                    </p>
                  </div>
                  <BriefingButton pending={briefing.isPending} onClick={() => briefing.mutate()} />
                </div>
                <div className="min-h-0 flex-1">
                  <Worklist items={data.worklist} />
                </div>
              </section>
              <RecentChanges changes={data.recent_changes} />
            </div>
          </div>
        )}
      </DataState>
    </div>
  );
}
