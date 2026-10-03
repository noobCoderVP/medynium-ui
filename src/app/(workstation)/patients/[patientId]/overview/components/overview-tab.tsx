"use client";

import { DataState } from "@/components/shared/data-state";
import { StatGrid } from "@/components/shared/stat-grid";
import { Stagger } from "@/components/shared/stagger";
import { StaggerItem } from "@/components/shared/stagger-item";
import { StatTile } from "@/components/shared/stat-tile";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney, formatNumber } from "@/lib/format";
import { useOverview } from "../hooks/use-overview";
import { DiagnosesCard } from "./diagnoses-card";
import { EventsCard } from "./events-card";
import { LabsCard } from "./labs-card";
import { MedicationsCard } from "./medications-card";

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}

/** Catch me up on this patient: the essentials, each with its date and source. */
export function OverviewTab({ patientId }: { patientId: string }) {
  const query = useOverview(patientId);
  return (
    <DataState query={query} skeleton={<OverviewSkeleton />}>
      {(p) => (
        <div className="space-y-4">
          <StatGrid>
            <StatTile
              label="Outpatient visits"
              value={formatNumber(p.utilization.opd_visits)}
              note={p.utilization.window}
            />
            <StatTile
              label="Emergency visits"
              value={formatNumber(p.utilization.emergency_visits)}
            />
            <StatTile label="Hospital stays" value={formatNumber(p.utilization.hospitalizations)} />
            <StatTile label="Procedures" value={formatNumber(p.utilization.procedures)} />
            <StatTile label="Billed" value={formatMoney(p.utilization.billed)} />
            <StatTile label="Approved" value={formatMoney(p.utilization.approved)} />
          </StatGrid>
          <Stagger className="grid gap-4 md:grid-cols-2">
            <StaggerItem className="[&>section]:h-full">
              <MedicationsCard patientId={patientId} medications={p.medications} />
            </StaggerItem>
            <StaggerItem className="[&>section]:h-full">
              <LabsCard patientId={patientId} labs={p.latest_labs} />
            </StaggerItem>
            <StaggerItem className="[&>section]:h-full">
              <DiagnosesCard diagnoses={p.diagnoses} />
            </StaggerItem>
            <StaggerItem className="[&>section]:h-full">
              <EventsCard patientId={patientId} events={p.recent_events} />
            </StaggerItem>
          </Stagger>
        </div>
      )}
    </DataState>
  );
}
