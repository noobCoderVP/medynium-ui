import { formatDate } from "@/lib/format";
import { ViewsDialog } from "./views-dialog";
import type { Overview } from "@/lib/api/types";

/** Who the workspace is showing, so the doctor and the assistant always agree on the scope. */
export function PatientHeader({ patient }: { patient: Overview }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-2">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{patient.name}</h1>
        <p className="text-sm text-muted-foreground">
          {patient.age}, {patient.sex}
          {patient.city ? ` · ${patient.city}` : ""} ·{" "}
          <span className="font-mono">{patient.patient_id}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground">Record as of {formatDate(patient.as_of)}</p>
        <ViewsDialog patientId={patient.patient_id} />
      </div>
    </header>
  );
}
