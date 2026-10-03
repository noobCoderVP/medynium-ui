import Link from "next/link";
import { ClampText } from "@/components/shared/clamp-text";
import { FlagChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { EncounterCell } from "@/components/shared/encounter-cell";
import type { PatientListItem } from "@/lib/api/types";
import type { SortOrder } from "@/lib/use-list-state";

const columns: Column<PatientListItem>[] = [
  {
    key: "name",
    header: "Patient",
    sortKey: "name",
    width: "24%",
    minWidth: "12rem",
    cell: (p) => (
      <Link
        href={`/patients/${p.patient_id}`}
        className="group inline-flex items-center gap-3 font-medium text-foreground"
      >
        <PatientAvatar name={p.name} />
        <span className="text-primary underline-offset-2 group-hover:underline">{p.name}</span>
      </Link>
    ),
  },
  {
    key: "age",
    header: "Age, sex",
    sortKey: "age",
    width: "10%",
    minWidth: "6rem",
    cell: (p) => `${p.age}, ${p.sex}`,
  },
  {
    key: "dx",
    header: "Main diagnoses",
    width: "30%",
    minWidth: "14rem",
    cell: (p) =>
      p.main_diagnoses.length ? (
        <ClampText text={p.main_diagnoses.join(", ")} />
      ) : (
        <span className="text-muted-foreground">None recorded</span>
      ),
  },
  {
    key: "last",
    header: "Last encounter",
    sortKey: "last_encounter",
    width: "20%",
    minWidth: "10rem",
    cell: (p) => <EncounterCell encounter={p.last_encounter} />,
  },
  {
    key: "flags",
    header: "Flags",
    sortKey: "flags",
    width: "16%",
    minWidth: "8rem",
    cell: (p) => (
      <span className="flex flex-wrap gap-1">
        {p.flags.map((flag) => (
          <FlagChip key={flag.type} flag={flag} />
        ))}
      </span>
    ),
  },
];

export const PATIENT_SORTS = [
  { key: "last_encounter", label: "Last encounter" },
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "flags", label: "Flags" },
];

export function PatientTable({
  items,
  sort,
  onSort,
}: {
  items: PatientListItem[];
  sort: { key: string; order: SortOrder };
  onSort: (key: string) => void;
}) {
  return (
    <DataTable
      caption="Patients"
      columns={columns}
      rows={items}
      rowKey={(p) => p.patient_id}
      sort={sort}
      onSort={onSort}
    />
  );
}
