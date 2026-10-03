"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { useTimeline } from "../hooks/use-timeline";
import { EventList } from "./event-list";
import { TimelineFilters } from "./timeline-filters";

export function TimelineTab({ patientId }: { patientId: string }) {
  const { query, from, to, selectedTypes, setRange, setTypes, clear } = useTimeline(patientId);
  return (
    <div className="space-y-3">
      <TimelineFilters
        from={from}
        to={to}
        selectedTypes={selectedTypes}
        onRange={setRange}
        onTypes={setTypes}
        onClear={clear}
      />
      <DataState
        query={query}
        skeleton={<SkeletonRows rows={6} />}
        isEmpty={(t) => t.items.length === 0}
        empty={<EmptyState title={copy.empty.timeline} />}
      >
        {(timeline) => (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {timeline.total} event{timeline.total === 1 ? "" : "s"}
            </p>
            <EventList patientId={patientId} events={timeline.items} />
          </div>
        )}
      </DataState>
    </div>
  );
}
