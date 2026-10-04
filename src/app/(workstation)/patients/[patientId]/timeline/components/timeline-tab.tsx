"use client";

import { TableSkeleton } from "@/components/shared/skeletons";
import { DataState } from "@/components/shared/data-state";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { PatientSummaryPanel } from "@/features/patient-summary";
import { copy } from "@/lib/copy";
import { useTimeline } from "../hooks/use-timeline";
import { EventList } from "./event-list";
import { TimelineFilters } from "./timeline-filters";

export function TimelineTab({ patientId }: { patientId: string }) {
  const timeline = useTimeline(patientId);
  return (
    <div
      data-fit
      className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)]"
    >
      <div className="lg:col-span-1 lg:min-h-0 lg:overflow-y-auto">
        <PatientSummaryPanel patientId={patientId} variant="rail" />
      </div>
      <div className="flex min-w-0 flex-col gap-3 lg:col-span-2 lg:min-h-0">
        <TimelineFilters
          list={timeline}
          selectedTypes={timeline.selectedTypes}
          onTypes={timeline.setTypes}
        />
        <DataState
          query={timeline.query}
          skeleton={<TableSkeleton />}
          isEmpty={(t) => t.total === 0}
          empty={<EmptyState title={copy.empty.timeline} />}
        >
          {(page) => (
            <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
              <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
                <EventList patientId={patientId} events={page.items} />
              </div>
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
    </div>
  );
}
