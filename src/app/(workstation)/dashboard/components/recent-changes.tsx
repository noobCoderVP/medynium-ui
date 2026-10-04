import Link from "next/link";
import { ChangeChip, StatusChip } from "@/components/shared/chips";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatValue } from "@/lib/format";
import type { Dashboard } from "@/lib/api/types";
import { groupByPatient, medicationKind } from "../lib/priority";

type Lab = Dashboard["recent_changes"]["labs"][number];
type Medication = Dashboard["recent_changes"]["medications"][number];

function PatientLink({ id, name, tab }: { id: string; name: string; tab: string }) {
  return (
    <Link
      href={`/patients/${id}?tab=${tab}`}
      className="text-sm font-semibold text-primary hover:underline"
    >
      {name}
    </Link>
  );
}

function LabLine({ lab }: { lab: Lab }) {
  const arrow =
    lab.previous === null
      ? null
      : lab.latest > lab.previous
        ? "↑"
        : lab.latest < lab.previous
          ? "↓"
          : "=";
  return (
    <li className="flex items-center justify-between gap-2 py-1">
      <div className="min-w-0">
        <p className="truncate text-sm">{lab.test}</p>
        <p className="text-xs text-muted-foreground">{formatDate(lab.date)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-right tabular-nums">
        <div>
          <p className="text-sm font-bold">{formatValue(lab.latest, lab.unit)}</p>
          {arrow ? (
            <p className="text-xs text-muted-foreground">
              {arrow} {formatValue(lab.previous!)}
            </p>
          ) : null}
        </div>
        {lab.abnormal ? <StatusChip tone="warn">{lab.abnormal.toUpperCase()}</StatusChip> : null}
      </div>
    </li>
  );
}

function MedicationLine({ medication: m }: { medication: Medication }) {
  return (
    <li className="flex items-center justify-between gap-2 py-1">
      <div className="min-w-0">
        <p className="truncate text-sm">{m.drug}</p>
        <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
      </div>
      <ChangeChip kind={medicationKind(m.change)}>{m.change.toUpperCase()}</ChangeChip>
    </li>
  );
}

function Group({
  id,
  name,
  tab,
  children,
}: {
  id: string;
  name: string;
  tab: string;
  children: React.ReactNode;
}) {
  return (
    <li className="py-2.5 first:pt-0 last:pb-0">
      <PatientLink id={id} name={name} tab={tab} />
      <ul className="mt-0.5 divide-y divide-border/60">{children}</ul>
    </li>
  );
}

/** The newest lab and medication changes across the caller's patients, grouped by patient, abnormal labs first. */
export function RecentChanges({ changes }: { changes: Dashboard["recent_changes"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:min-h-0 lg:grid-cols-1 lg:grid-rows-2 xl:contents">
      <Card className="flex min-h-0 flex-col">
        <CardHeader className="px-4 py-3">
          <CardTitle>Recent lab results</CardTitle>
        </CardHeader>
        <CardBody className="min-h-0 flex-1 overflow-y-auto p-4">
          {changes.labs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new results.</p>
          ) : (
            <ul className="divide-y divide-border">
              {groupByPatient(changes.labs).map((g) => (
                <Group key={g.patient_id} id={g.patient_id} name={g.name} tab="labs">
                  {g.rows.map((lab) => (
                    <LabLine key={`${lab.test}-${lab.date}`} lab={lab} />
                  ))}
                </Group>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
      <Card className="flex min-h-0 flex-col">
        <CardHeader className="px-4 py-3">
          <CardTitle>Recent medication changes</CardTitle>
        </CardHeader>
        <CardBody className="min-h-0 flex-1 overflow-y-auto p-4">
          {changes.medications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new changes.</p>
          ) : (
            <ul className="divide-y divide-border">
              {groupByPatient(changes.medications).map((g) => (
                <Group key={g.patient_id} id={g.patient_id} name={g.name} tab="medications">
                  {g.rows.map((m) => (
                    <MedicationLine key={`${m.drug}-${m.date}`} medication={m} />
                  ))}
                </Group>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
