import { RowList, Row } from "@/components/shared/row-list";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { ValueWithSource } from "@/components/shared/value-with-source";
import type { Diagnosis } from "../types";

export function DiagnosesCard({ diagnoses }: { diagnoses: Diagnosis[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnoses</CardTitle>
      </CardHeader>
      <CardBody>
        {diagnoses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No diagnoses on record.</p>
        ) : (
          <RowList>
            {diagnoses.map((d) => (
              <Row key={d.diagnosis_id}>
                <ValueWithSource value={d.description} source={d.source ?? "CLINICAL.DIAGNOSIS"}>
                  <p className="text-xs text-muted-foreground">
                    {d.onset_year ? `Since ${d.onset_year}` : "Onset not recorded"}
                    {d.code ? ` · code ${d.code}` : ""}
                  </p>
                </ValueWithSource>
              </Row>
            ))}
          </RowList>
        )}
      </CardBody>
    </Card>
  );
}
