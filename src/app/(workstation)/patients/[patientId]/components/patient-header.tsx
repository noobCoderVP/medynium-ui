import { TriangleAlert } from "lucide-react";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { abnormalLabs } from "@/lib/abnormal-labs";
import type { Overview } from "@/lib/api/types";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AllergyBanner } from "./allergy-banner";
import { AttentionChip } from "./attention-chip";
import { HistoryDialog } from "./history-dialog";
import { ShareDialog } from "./share-dialog";
import { ViewsDialog } from "./views-dialog";

/**
 * Who the workspace is showing, so the doctor and the assistant always agree on the scope. Expanded at the top of a
 * page; once the page scrolls it collapses to one identity line plus the two things that must stay visible, the
 * attention count and the allergies.
 */
export function PatientHeader({
  patient,
  tabLabel,
  compact,
}: {
  patient: Overview;
  tabLabel?: string;
  compact: boolean;
}) {
  const abnormal = abnormalLabs(patient.latest_labs).length;
  const meds = patient.medications.length;
  const allergyCount = patient.allergies.length;
  return (
    <header
      className={cn(
        "flex flex-col gap-1.5 px-4 transition-[padding] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4",
        compact ? "py-1.5" : "py-3",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <PatientAvatar
          name={patient.name}
          className={cn("shrink-0", compact ? "size-8 text-xs" : "size-11 text-base")}
        />
        <div className="min-w-0">
          {tabLabel && !compact ? (
            <Breadcrumbs
              crumbs={[
                { label: "Patients", href: "/patients" },
                { label: patient.name, href: `/patients/${patient.patient_id}` },
                { label: tabLabel },
              ]}
            />
          ) : null}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <h1
              className={cn("truncate font-bold tracking-tight", compact ? "text-base" : "text-xl")}
            >
              {patient.name}
            </h1>
            <span className="text-sm text-muted-foreground">
              {patient.age} {patient.sex}
              {patient.city && !compact ? ` · ${patient.city}` : ""} ·{" "}
              <span className="font-mono">{patient.patient_id}</span>
            </span>
            {!compact && (patient.treating_doctors ?? []).length > 0 ? (
              <span className="text-sm text-muted-foreground">
                Treating: {(patient.treating_doctors ?? []).join(", ")}
              </span>
            ) : null}
            {compact && allergyCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-warn">
                <TriangleAlert className="size-3.5" aria-hidden="true" />
                {allergyCount === 1 ? "1 allergy" : `${allergyCount} allergies`}
              </span>
            ) : null}
          </div>
          {compact ? null : (
            <>
              <div className="mt-1 text-sm">
                <AllergyBanner allergies={patient.allergies} />
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <AttentionChip patient={patient} />
                <span>
                  {meds} {meds === 1 ? "medication" : "medications"}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {abnormal} abnormal {abnormal === 1 ? "result" : "results"}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {compact ? <AttentionChip patient={patient} /> : null}
        {compact ? null : (
          <p className="text-xs text-muted-foreground">Updated {formatShortDate(patient.as_of)}</p>
        )}
        <HistoryDialog patientId={patient.patient_id} />
        <ViewsDialog patientId={patient.patient_id} />
        <ShareDialog patientId={patient.patient_id} patientName={patient.name} />
      </div>
    </header>
  );
}
