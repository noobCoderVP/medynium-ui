import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { PatientWorkspace } from "./components/patient-workspace";
import { parseTab, type TabId } from "./lib/tabs";
import { ClaimsTab } from "./claims/components/claims-tab";
import { LabsTab } from "./labs/components/labs-tab";
import { MedicationsTab } from "./medications/components/medications-tab";
import { NotesTab } from "./notes/components/notes-tab";
import { OverviewTab } from "./overview/components/overview-tab";
import { ReportsTab } from "./reports/components/reports-tab";
import { SafetyTab } from "./safety/components/safety-tab";
import { SimilarTab } from "./similar/components/similar-tab";
import { TimelineTab } from "./timeline/components/timeline-tab";

export const metadata: Metadata = { title: "Patient" };

function tabContent(tab: TabId, patientId: string): ReactNode {
  switch (tab) {
    case "overview":
      return <OverviewTab patientId={patientId} />;
    case "timeline":
      return <TimelineTab patientId={patientId} />;
    case "medications":
      return <MedicationsTab patientId={patientId} />;
    case "labs":
      return <LabsTab patientId={patientId} />;
    case "claims":
      return <ClaimsTab patientId={patientId} />;
    case "notes":
      return <NotesTab patientId={patientId} />;
    case "reports":
      return <ReportsTab patientId={patientId} />;
    case "similar":
      return <SimilarTab patientId={patientId} />;
    case "safety":
      return <SafetyTab patientId={patientId} />;
  }
}

export default async function PatientPage({
  params,
  searchParams,
}: PageProps<"/patients/[patientId]">) {
  const { patientId } = await params;
  const tab = parseTab((await searchParams).tab);
  return (
    <PatientWorkspace patientId={patientId} tab={tab}>
      {/* Tabs that read search params on the client (date range, lab code) need a Suspense boundary. */}
      <Suspense>{tabContent(tab, patientId)}</Suspense>
    </PatientWorkspace>
  );
}
