import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { formatDate } from "@/lib/format";
import { ShareDialog } from "./share-dialog";
import { ViewsDialog } from "./views-dialog";
import type { Overview } from "@/lib/api/types";

/** Who the workspace is showing, so the doctor and the assistant always agree on the scope. */
export function PatientHeader({ patient, tabLabel }: { patient: Overview; tabLabel?: string }) {
  return (
    <header className="flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <PatientAvatar name={patient.name} className="size-11 shrink-0 text-base sm:size-12" />
        <div className="min-w-0">
          <Breadcrumbs
            crumbs={[
              { label: "Patients", href: "/patients" },
              ...(tabLabel
                ? [
                    { label: patient.name, href: `/patients/${patient.patient_id}` },
                    { label: tabLabel },
                  ]
                : [{ label: patient.name }]),
            ]}
          />
          <h1 className="truncate text-xl font-bold tracking-tight">{patient.name}</h1>
          <p className="text-sm text-muted-foreground">
            {patient.age}, {patient.sex}
            {patient.city ? ` · ${patient.city}` : ""} ·{" "}
            <span className="font-mono">{patient.patient_id}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="w-full text-xs text-muted-foreground sm:w-auto">
          Record as of {formatDate(patient.as_of)}
        </p>
        <ShareDialog patientId={patient.patient_id} patientName={patient.name} />
        <ViewsDialog patientId={patient.patient_id} />
      </div>
    </header>
  );
}
