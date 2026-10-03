import Link from "next/link";
import { FlagChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/state-panels";
import { EncounterCell } from "@/components/shared/encounter-cell";
import { copy } from "@/lib/copy";
import type { WorklistItem } from "@/lib/api/types";

const columns: Column<WorklistItem>[] = [
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
    key: "last",
    header: "Last encounter",
    sortValue: (p) => p.last_encounter.date ?? "",
    cell: (p) => <EncounterCell encounter={p.last_encounter} />,
  },
  {
    key: "flags",
    header: "What changed",
    sortValue: (p) => -p.flags.length,
    cell: (p) =>
      p.flags.length === 0 ? (
        <span className="text-muted-foreground">No change</span>
      ) : (
        <span className="flex flex-wrap gap-1">
          {p.flags.map((flag) => (
            <FlagChip key={flag.type} flag={flag} />
          ))}
        </span>
      ),
  },
];

/** The doctor's morning list: who needs attention and what changed since the last visit. */
export function Worklist({ items }: { items: WorklistItem[] }) {
  if (items.length === 0) return <EmptyState title={copy.empty.worklist} />;
  return (
    <DataTable
      caption="Patients on your list"
      columns={columns}
      rows={items}
      rowKey={(p) => p.patient_id}
      initialSort={{ key: "flags", direction: "asc" }}
    />
  );
}
