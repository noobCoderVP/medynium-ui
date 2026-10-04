"use client";

import type { ReactNode } from "react";
import { DataState } from "@/components/shared/data-state";
import { NotFoundState } from "@/components/shared/state-panels";
import { usePatient } from "../hooks/use-patient";
import { TABS, type TabId } from "../lib/tabs";
import { AttentionPanel } from "./attention-panel";
import { PatientHeader } from "./patient-header";
import { RecentChanges } from "./recent-changes";
import { TabBar } from "./tab-bar";

/**
 * The gate for everything under a patient. A denied patient and a missing one both end here, in the same
 * not-found state, with no header, tabs or hint that the patient exists (SEC-05, UX rule 8). The tab content
 * is only rendered once the patient has loaded, so it never shows a second, different error.
 */
export function PatientWorkspace({
  patientId,
  tab,
  children,
}: {
  patientId: string;
  tab: TabId;
  children: ReactNode;
}) {
  const query = usePatient(patientId);
  return (
    <DataState query={query} notFound={<NotFoundState />}>
      {(patient) => (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <PatientHeader
              patient={patient}
              tabLabel={tab === "overview" ? undefined : TABS.find((t) => t.id === tab)?.label}
            />
            <AttentionPanel patient={patient} />
            <RecentChanges patient={patient} />
          </div>
          <TabBar patientId={patientId} active={tab} />
          <div id="patient-tab-content">{children}</div>
        </div>
      )}
    </DataState>
  );
}
