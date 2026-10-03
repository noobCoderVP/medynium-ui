import Link from "next/link";
import { FlagChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EncounterCell } from "@/components/shared/encounter-cell";
import type { PatientListItem } from "@/lib/api/types";

const columns: Column<PatientListItem>[] = [
  {
    key: "name",
    header: "Patient",
    sortValue: (p) => p.name,
    cell: (p) => (
      <Link
        href={`/patients/${p.patient_id}`}
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        {p.name}
      </Link>
    ),
  },
  { key: "age", header: "Age, sex", sortValue: (p) => p.age, cell: (p) => `${p.age}, ${p.sex}` },
  {
    key: "dx",
    header: "Main diagnoses",
    cell: (p) =>
      p.main_diagnoses.length ? (
        p.main_diagnoses.join(", ")
      ) : (
        <span className="text-muted-foreground">None recorded</span>
      ),
    className: "max-w-xs",
  },
  {
    key: "last",
    header: "Last encounter",
    sortValue: (p) => p.last_encounter.date ?? "",
    cell: (p) => <EncounterCell encounter={p.last_encounter} />,
  },
  {
    key: "flags",
    header: "Flags",
    sortValue: (p) => -p.flags.length,
    cell: (p) => (
      <span className="flex flex-wrap gap-1">
        {p.flags.map((flag) => (
          <FlagChip key={flag.type} flag={flag} />
        ))}
      </span>
    ),
  },
];

export function PatientTable({ items }: { items: PatientListItem[] }) {
  return (
    <DataTable
      caption="Patients"
      columns={columns}
      rows={items}
      rowKey={(p) => p.patient_id}
      initialSort={{ key: "name", direction: "asc" }}
    />
  );
}
