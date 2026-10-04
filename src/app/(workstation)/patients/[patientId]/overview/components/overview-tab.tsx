"use client";

import { DataState } from "@/components/shared/data-state";
import { StatGrid } from "@/components/shared/stat-grid";
import { Stagger } from "@/components/shared/stagger";
import { StaggerItem } from "@/components/shared/stagger-item";
import { StatTile } from "@/components/shared/stat-tile";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";
import { useOverview } from "../hooks/use-overview";
import { ClinicalSummaryCard } from "./clinical-summary-card";
import { DiagnosesCard } from "./diagnoses-card";
import { EventsCard } from "./events-card";
import { LabsCard } from "./labs-card";
import { MedicationsCard } from "./medications-card";
import { OverviewSection } from "./overview-section";

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}

/**
 * Catch me up on this patient, in order: snapshot counts, then the clinical overview (summary beside latest
 * results), then medications and recent activity, each with its date and source. Billing is deliberately absent
 * here (minimum necessary for a clinical view); it lives on the Claims tab.
 */
export function OverviewTab({ patientId }: { patientId: string }) {
  const query = useOverview(patientId);
  return (
    <DataState query={query} skeleton={<OverviewSkeleton />}>
      {(p) => (
        <div className="space-y-4">
          <OverviewSection title="Patient snapshot">
            <StatGrid className="md:grid-cols-4 xl:grid-cols-4">
              <StatTile
                label="Outpatient visits"
                value={formatNumber(p.utilization.opd_visits)}
                note={p.utilization.window}
              />
              <StatTile
                label="Emergency visits"
                value={formatNumber(p.utilization.emergency_visits)}
                note={p.utilization.window}
              />
              <StatTile
                label="Hospital stays"
                value={formatNumber(p.utilization.hospitalizations)}
                note={p.utilization.window}
              />
              <StatTile
                label="Procedures"
                value={formatNumber(p.utilization.procedures)}
                note={p.utilization.window}
              />
            </StatGrid>
          </OverviewSection>
          <OverviewSection title="Clinical overview">
            <Stagger className="grid gap-4 lg:grid-cols-2">
              <StaggerItem className="[&>section]:h-full">
                <ClinicalSummaryCard patient={p} />
              </StaggerItem>
              <StaggerItem className="[&>section]:h-full">
                <LabsCard patientId={patientId} labs={p.latest_labs} />
              </StaggerItem>
            </Stagger>
          </OverviewSection>
          <OverviewSection title="Medications">
            <MedicationsCard patientId={patientId} medications={p.medications} />
          </OverviewSection>
          <OverviewSection title="Recent activity">
            <Stagger className="grid gap-4 md:grid-cols-2">
              <StaggerItem className="[&>section]:h-full">
                <DiagnosesCard diagnoses={p.diagnoses} />
              </StaggerItem>
              <StaggerItem className="[&>section]:h-full">
                <EventsCard patientId={patientId} events={p.recent_events} />
              </StaggerItem>
            </Stagger>
          </OverviewSection>
        </div>
      )}
    </DataState>
  );
}
