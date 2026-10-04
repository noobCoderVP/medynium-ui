"use client";

import type { ReactNode } from "react";
import { DataState } from "@/components/shared/data-state";
import { NotFoundState } from "@/components/shared/state-panels";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatient } from "../hooks/use-patient";
import { TABS, type TabId } from "../lib/tabs";
import { AttentionPanel } from "./attention-panel";
import { PatientHeader } from "./patient-header";
import { RecentChanges } from "./recent-changes";
import { TabBar } from "./tab-bar";

function WorkspaceSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-14 w-72" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

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
    <DataState query={query} skeleton={<WorkspaceSkeleton />} notFound={<NotFoundState />}>
      {(patient) => (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
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
