import Link from "next/link";
import { StatusChip } from "@/components/shared/chips";
import { ValueWithSource } from "@/components/shared/value-with-source";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { OverviewMedication } from "../types";

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
          All medications
        </Link>
      </CardHeader>
      <CardBody>
        {medications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No current medications on record.</p>
        ) : (
          <ul className="divide-y divide-border">
            {medications.map((m) => (
              <li
                key={m.medication_id}
                className="flex items-start justify-between gap-3 py-2 text-sm"
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
                {m.in_knowledge_base ? (
                  <StatusChip tone="ok">label indexed</StatusChip>
                ) : (
                  <StatusChip tone="muted">label not indexed</StatusChip>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
