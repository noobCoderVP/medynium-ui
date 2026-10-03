import Link from "next/link";
import { StatusChip } from "@/components/shared/chips";
import { ValueWithSource } from "@/components/shared/value-with-source";
import { RowList, Row } from "@/components/shared/row-list";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatValue } from "@/lib/format";
import type { OverviewLab } from "../types";

export function LabsCard({ patientId, labs }: { patientId: string; labs: OverviewLab[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest results</CardTitle>
        <Link
          href={`/patients/${patientId}?tab=labs`}
          className="text-xs font-medium text-primary hover:underline"
        >
          All results
        </Link>
      </CardHeader>
      <CardBody>
        {labs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lab results on record.</p>
        ) : (
          <RowList>
            {labs.map((lab) => (
              <Row key={lab.lab_id} className="flex items-start justify-between gap-3">
                <ValueWithSource
                  value={
                    <Link
                      href={`/patients/${patientId}?tab=labs&lab=${encodeURIComponent(lab.code)}`}
                      className="text-primary hover:underline"
                    >
                      {lab.test}: {formatValue(lab.value, lab.unit)}
                    </Link>
                  }
                  date={lab.date}
                  source={lab.source ?? "CLINICAL.LAB_RESULT"}
                >
                  {lab.previous ? (
                    <p className="text-xs text-muted-foreground">
                      Previous {formatValue(lab.previous.value, lab.unit)} on{" "}
                      {formatDate(lab.previous.date)}
                    </p>
                  ) : null}
                </ValueWithSource>
                {lab.flag && lab.flag !== "NORMAL" ? (
                  <StatusChip tone="warn">{lab.flag.toLowerCase()}</StatusChip>
                ) : null}
              </Row>
            ))}
          </RowList>
        )}
      </CardBody>
    </Card>
  );
}
