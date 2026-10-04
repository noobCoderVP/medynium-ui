import Link from "next/link";
import { StatusChip } from "@/components/shared/chips";
import { ValueWithSource } from "@/components/shared/value-with-source";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { OverviewMedication } from "../types";

/** Medicines as a compact grid of tiles, so a short list fills its row instead of leaving empty space. */
export function MedicationsCard({
  patientId,
  medications,
}: {
  patientId: string;
  medications: OverviewMedication[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current medications</CardTitle>
        <Link
          href={`/patients/${patientId}?tab=medications`}
          className="text-xs font-medium text-primary hover:underline"
        >
          View all medications
        </Link>
      </CardHeader>
      <CardBody>
        {medications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No current medications on record.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {medications.map((m) => (
              <li
                key={m.medication_id}
                className="flex flex-col justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
              >
                <ValueWithSource
                  value={`${m.drug}${m.dose ? `, ${m.dose}` : ""}`}
                  date={m.started}
                  source={m.source ?? "CLINICAL.MEDICATION"}
                >
                  {m.change ? (
                    <p className="text-xs text-muted-foreground">
                      {m.change}
                      {m.last_change_date ? ` (${formatDate(m.last_change_date)})` : ""}
                    </p>
                  ) : null}
                </ValueWithSource>
                <div>
                  {m.in_knowledge_base ? (
                    <StatusChip tone="ok">label indexed</StatusChip>
                  ) : (
                    <StatusChip tone="muted">label not indexed</StatusChip>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
