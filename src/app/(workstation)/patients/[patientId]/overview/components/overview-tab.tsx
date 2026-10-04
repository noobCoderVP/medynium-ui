"use client";

import { CardsSkeleton } from "@/components/shared/skeletons";
import { DataState } from "@/components/shared/data-state";
import { StatGrid } from "@/components/shared/stat-grid";
import { Stagger } from "@/components/shared/stagger";
import { StaggerItem } from "@/components/shared/stagger-item";
import { StatTile } from "@/components/shared/stat-tile";
import { formatNumber } from "@/lib/format";
import { useBrief } from "../hooks/use-brief";
import { useOverview } from "../hooks/use-overview";
import { BriefAttention } from "./brief-attention";
import { BriefChanges } from "./brief-changes";
import { BriefGaps } from "./brief-gaps";
import { PatientSummaryPanel } from "@/features/patient-summary";
import { ClinicalBrief } from "./clinical-brief";
import { DiagnosesCard } from "./diagnoses-card";
import { EventsCard } from "./events-card";
import { LabsCard } from "./labs-card";
import { OverviewSection } from "./overview-section";

/**
 * Catch me up on this patient, in order: attention first, then the clinical overview (summary beside latest
 * results), a 12-month snapshot and recent activity (medications have their own tab), each with its date and source. Billing is deliberately absent
 * here (minimum necessary for a clinical view); it lives on the Claims tab.
 */
export function OverviewTab({ patientId }: { patientId: string }) {
  const query = useOverview(patientId);
  const brief = useBrief(patientId);
  return (
    <DataState query={query} skeleton={<CardsSkeleton />}>
      {(p) => (
        <div className="space-y-4">
          {brief.data ? (
            <>
              <ClinicalBrief brief={brief.data} />
              <PatientSummaryPanel patientId={patientId} />
              <div className="grid gap-4 lg:grid-cols-2">
                <BriefAttention
                  patientId={patientId}
                  items={brief.data.attention.items}
                  high={brief.data.attention.counts.high ?? 0}
                />
                <BriefChanges patientId={patientId} initial={brief.data.changes} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <BriefGaps patientId={patientId} items={brief.data.gaps} />
                <LabsCard patientId={patientId} labs={p.latest_labs} />
              </div>
            </>
          ) : (
            <>
              {brief.isError ? (
                <p role="alert" className="text-sm text-muted-foreground">
                  The brief could not be loaded. The record below is unaffected.
                </p>
              ) : (
                <CardsSkeleton />
              )}
              <LabsCard patientId={patientId} labs={p.latest_labs} />
            </>
          )}
          <OverviewSection
            title={`Last 12 months${p.utilization.window ? ` · ${p.utilization.window}` : ""}`}
          >
            <StatGrid className="md:grid-cols-4 xl:grid-cols-4">
              <StatTile label="Outpatient visits" value={formatNumber(p.utilization.opd_visits)} />
              <StatTile
                label="Emergency visits"
                value={formatNumber(p.utilization.emergency_visits)}
              />
              <StatTile
                label="Hospital stays"
                value={formatNumber(p.utilization.hospitalizations)}
              />
              <StatTile label="Procedures" value={formatNumber(p.utilization.procedures)} />
            </StatGrid>
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
