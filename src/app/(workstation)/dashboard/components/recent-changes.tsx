import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/shared/chips";
import { formatDate, formatValue } from "@/lib/format";
import type { Dashboard } from "@/lib/api/types";

/** The newest lab and medication changes across the caller's patients, abnormal labs first. */
export function RecentChanges({ changes }: { changes: Dashboard["recent_changes"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent lab results</CardTitle>
        </CardHeader>
        <CardBody>
          {changes.labs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new results.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {changes.labs.map((lab) => (
                <li
                  key={`${lab.patient_id}-${lab.test}-${lab.date}`}
                  className="flex items-center justify-between gap-3 py-2"
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
                  <div className="flex shrink-0 items-center gap-2 tabular-nums">
                    <span>
                      {formatValue(lab.latest, lab.unit)}
                      {lab.previous !== null ? (
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          from {formatValue(lab.previous)}
                        </span>
                      ) : null}
                    </span>
                    {lab.abnormal ? (
                      <StatusChip tone="warn">{lab.abnormal.toLowerCase()}</StatusChip>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
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
            <ul className="divide-y divide-border text-sm">
              {changes.medications.map((m) => (
                <li key={`${m.patient_id}-${m.drug}-${m.date}`} className="py-2">
                  <Link
                    href={`/patients/${m.patient_id}?tab=medications`}
                    className="font-medium text-primary hover:underline"
                  >
                    {m.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {m.drug}: {m.change} · {formatDate(m.date)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
