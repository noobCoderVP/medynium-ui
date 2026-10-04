"use client";

import { DataState } from "@/components/shared/data-state";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { copy } from "@/lib/copy";
import { useTimeline } from "../hooks/use-timeline";
import { EventList } from "./event-list";
import { TimelineFilters } from "./timeline-filters";

export function TimelineTab({ patientId }: { patientId: string }) {
  const timeline = useTimeline(patientId);
  return (
    <div className="space-y-3">
      <TimelineFilters
        list={timeline}
        selectedTypes={timeline.selectedTypes}
        onTypes={timeline.setTypes}
      />
      <DataState
        query={timeline.query}
        isEmpty={(t) => t.total === 0}
        empty={<EmptyState title={copy.empty.timeline} />}
      >
        {(page) => (
          <div className="space-y-3">
            <EventList patientId={patientId} events={page.items} />
            <Pagination
              noun="events"
              total={page.total}
              offset={timeline.offset}
              limit={timeline.limit}
              onOffsetChange={timeline.setOffset}
              onLimitChange={timeline.setLimit}
            />
          </div>
        )}
      </DataState>
    </div>
  );
}
