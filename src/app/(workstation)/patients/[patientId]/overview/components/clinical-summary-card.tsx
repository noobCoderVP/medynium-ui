import { TagChip } from "@/components/shared/chips";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import type { Overview } from "@/lib/api/types";
import { formatValue } from "@/lib/format";
import { EvidenceDrawer } from "./evidence-drawer";
import { abnormalLabs } from "@/lib/abnormal-labs";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * A plain-language orientation built only from the recorded overview (counts and flagged results), so every
 * statement is a patient fact. It states what is recorded and never suggests a diagnosis or action.
 */
export function ClinicalSummaryCard({ patient }: { patient: Overview }) {
  const flagged = abnormalLabs(patient.latest_labs);
  return (
    <Card className="border-fact/25 bg-fact-soft/40">
      <CardHeader>
        <CardTitle>Clinical summary</CardTitle>
        <TagChip tag="patient_fact" />
      </CardHeader>
      <CardBody className="space-y-3">
        <p className="text-sm leading-relaxed">
          {patient.age}-year-old {patient.sex.toLowerCase() === "f" ? "female" : patient.sex} with{" "}
          {patient.diagnoses.length} recorded{" "}
          {patient.diagnoses.length === 1 ? "diagnosis" : "diagnoses"},{" "}
          {plural(patient.medications.length, "current medication")} and{" "}
          {flagged.length === 0
            ? "no results outside the reference range"
            : `${plural(flagged.length, "result")} outside the reference range: ${flagged
                .map((lab) => `${lab.test} ${formatValue(lab.value, lab.unit)}`)
                .join(", ")}`}
          .
        </p>
        {flagged.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Key considerations
            </h3>
            <ul className="mt-1.5 space-y-1 text-sm">
              {flagged.map((lab) => (
                <li key={lab.lab_id} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-crit" aria-hidden="true" />
                  {lab.test} {lab.flag === "HIGH" ? "above" : "below"} range
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Sources:{" "}
            {patient.diagnoses.length + patient.medications.length + patient.latest_labs.length}{" "}
            records
          </p>
          <EvidenceDrawer patient={patient} />
        </div>
      </CardBody>
    </Card>
  );
}
