import Link from "next/link";
import { RowList, Row } from "@/components/shared/row-list";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/shared/chips";
import { formatDate, formatValue } from "@/lib/format";
import type { Dashboard } from "@/lib/api/types";

/** The newest lab and medication changes across the caller's patients, abnormal labs first. */
export function RecentChanges({ changes }: { changes: Dashboard["recent_changes"] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Recent lab results</CardTitle>
        </CardHeader>
        <CardBody>
          {changes.labs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new results.</p>
          ) : (
            <RowList>
              {changes.labs.map((lab) => (
                <Row
                  key={`${lab.patient_id}-${lab.test}-${lab.date}`}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/patients/${lab.patient_id}?tab=labs`}
                      className="font-medium text-primary hover:underline"
                    >
                      {lab.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {lab.test} · {formatDate(lab.date)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right tabular-nums">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-base font-bold">
                        {formatValue(lab.latest, lab.unit)}
                      </span>
                      {lab.abnormal ? (
                        <StatusChip tone="warn">{lab.abnormal.toLowerCase()}</StatusChip>
                      ) : null}
                    </div>
                    {lab.previous !== null ? (
                      <p className="text-xs text-muted-foreground">
                        {lab.latest > lab.previous ? "↑" : lab.latest < lab.previous ? "↓" : "="}{" "}
                        from {formatValue(lab.previous)}
                      </p>
                    ) : null}
                  </div>
                </Row>
              ))}
            </RowList>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent medication changes</CardTitle>
        </CardHeader>
        <CardBody>
          {changes.medications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new changes.</p>
          ) : (
            <RowList>
              {changes.medications.map((m) => (
                <Row key={`${m.patient_id}-${m.drug}-${m.date}`}>
                  <Link
                    href={`/patients/${m.patient_id}?tab=medications`}
                    className="font-medium text-primary hover:underline"
                  >
                    {m.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {m.drug}: {m.change} · {formatDate(m.date)}
                  </p>
                </Row>
              ))}
            </RowList>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
