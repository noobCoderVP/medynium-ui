import Link from "next/link";
import { StatusChip } from "@/components/shared/chips";
import { ValueWithSource } from "@/components/shared/value-with-source";
import { RowList, Row } from "@/components/shared/row-list";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatValue } from "@/lib/format";
import { cn } from "@/lib/utils";
import { labDelta } from "@/lib/abnormal-labs";
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
          View trends
        </Link>
      </CardHeader>
      <CardBody>
        {labs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lab results on record.</p>
        ) : (
          <RowList>
            {labs.map((lab) => {
              const abnormal = lab.flag === "HIGH" || lab.flag === "LOW";
              const delta = labDelta(lab);
              return (
                <Row
                  key={lab.lab_id}
                  className={cn(
                    "flex items-start justify-between gap-3 py-1.5",
                    abnormal && "border-l-2 border-l-crit bg-crit-soft/40",
                  )}
                >
                  <ValueWithSource
                    value={
                      <Link
                        href={`/patients/${patientId}?tab=labs&lab=${encodeURIComponent(lab.code)}`}
                        className={cn(
                          "hover:underline",
                          abnormal ? "font-semibold text-crit" : "text-primary",
                        )}
                      >
                        {lab.test}: {formatValue(lab.value, lab.unit)}
                        {delta ? ` ${delta.text}` : ""}
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
                  {abnormal ? (
                    <StatusChip tone="crit">{lab.flag === "HIGH" ? "↑ high" : "↓ low"}</StatusChip>
                  ) : null}
                </Row>
              );
            })}
          </RowList>
        )}
      </CardBody>
    </Card>
  );
}
