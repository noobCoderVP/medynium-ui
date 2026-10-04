import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { StatusChip } from "@/components/shared/chips";
import { formatShortDate } from "@/lib/format";
import { abnormalLabs } from "@/lib/abnormal-labs";
import { AllergyBanner } from "./allergy-banner";
import { HistoryDialog } from "./history-dialog";
import { ShareDialog } from "./share-dialog";
import { ViewsDialog } from "./views-dialog";
import type { Overview } from "@/lib/api/types";

/** Who the workspace is showing, so the doctor and the assistant always agree on the scope. */
export function PatientHeader({ patient, tabLabel }: { patient: Overview; tabLabel?: string }) {
  const attention = abnormalLabs(patient.latest_labs).length;
  const meds = patient.medications.length;
  return (
    <header className="flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <PatientAvatar name={patient.name} className="size-11 shrink-0 text-base" />
        <div className="min-w-0">
          {tabLabel ? (
            <Breadcrumbs
              crumbs={[
                { label: "Patients", href: "/patients" },
                { label: patient.name, href: `/patients/${patient.patient_id}` },
                { label: tabLabel },
              ]}
            />
          ) : null}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <h1 className="truncate text-xl font-bold tracking-tight">{patient.name}</h1>
            <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
              <span>
                {patient.age} {patient.sex}
                {patient.city ? ` · ${patient.city}` : ""} ·{" "}
                <span className="font-mono">{patient.patient_id}</span>
              </span>
              <span aria-hidden="true">·</span>
              <AllergyBanner allergies={patient.allergies} />
            </p>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-1.5">
            <StatusChip tone={attention > 0 ? "crit" : "ok"}>
              {attention > 0
                ? `${attention} ${attention === 1 ? "attention item" : "attention items"}`
                : "No flagged results"}
            </StatusChip>
            <StatusChip tone="muted">{`${meds} ${meds === 1 ? "medication" : "medications"}`}</StatusChip>
            <StatusChip tone={attention > 0 ? "warn" : "ok"}>
              {`${attention} abnormal ${attention === 1 ? "result" : "results"}`}
            </StatusChip>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-xs text-muted-foreground">Updated {formatShortDate(patient.as_of)}</p>
        <HistoryDialog patientId={patient.patient_id} />
        <ViewsDialog patientId={patient.patient_id} />
        <ShareDialog patientId={patient.patient_id} patientName={patient.name} />
      </div>
    </header>
  );
}
