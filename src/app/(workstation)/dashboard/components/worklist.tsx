import Link from "next/link";
import { FlagChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/state-panels";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { EncounterCell } from "@/components/shared/encounter-cell";
import { copy } from "@/lib/copy";
import type { Flag, WorklistItem } from "@/lib/api/types";

/** Urgent first: an emergency visit outranks new results, which outrank the rest. */
const RANK: Record<Flag["type"], number> = {
  RECENT_EMERGENCY: 0,
  NEW_LAB: 1,
  NEW_MEDICATION: 2,
  NEW_DOCUMENT: 3,
};

/** Clinical urgency for sorting: lower is more urgent. */
function urgency(p: WorklistItem): number {
  if (p.flags.length === 0) return 99;
  return Math.min(...p.flags.map((f) => RANK[f.type])) * 10 - p.flags.length;
}

/** How many patients carry an urgent flag (a recent emergency visit). */
export function countUrgent(items: WorklistItem[]): number {
  return items.filter((p) => p.flags.some((f) => f.type === "RECENT_EMERGENCY")).length;
}

const columns: Column<WorklistItem>[] = [
  {
    key: "name",
    header: "Patient",
    width: "26%",
    minWidth: "11rem",
    sortValue: (p) => p.name,
    cell: (p) => (
      <Link
        href={`/patients/${p.patient_id}`}
        className="group inline-flex items-center gap-2.5 font-semibold text-foreground"
      >
        <PatientAvatar
          name={p.name}
          className="size-7 bg-muted text-[0.65rem] text-foreground/70"
        />
        <span className="text-primary underline-offset-2 group-hover:underline">{p.name}</span>
      </Link>
    ),
  },
  {
    key: "age",
    header: "Age / sex",
    width: "11%",
    minWidth: "5.5rem",
    sortValue: (p) => p.age,
    cell: (p) => <span className="tabular-nums">{`${p.age} / ${p.sex}`}</span>,
  },
  {
    key: "last",
    header: "Last encounter",
    width: "23%",
    minWidth: "11rem",
    sortValue: (p) => p.last_encounter.date ?? "",
    cell: (p) => <EncounterCell encounter={p.last_encounter} />,
  },
  {
    key: "flags",
    header: "Changes",
    minWidth: "14rem",
    sortValue: urgency,
    cell: (p) => {
      if (p.flags.length === 0) return <span className="text-muted-foreground">No change</span>;
      const flags = [...p.flags].sort((a, b) => RANK[a.type] - RANK[b.type]);
      return (
        <span className="flex flex-wrap gap-1">
          {flags.map((flag) => (
            <FlagChip key={flag.type} flag={flag} />
          ))}
        </span>
      );
    },
  },
];

/** The doctor's morning list: who needs attention and what changed since the last visit. */
export function Worklist({ items }: { items: WorklistItem[] }) {
  if (items.length === 0) return <EmptyState title={copy.empty.worklist} />;
  return (
    <DataTable
      caption="Patients needing attention"
      columns={columns}
      rows={items}
      rowKey={(p) => p.patient_id}
      initialSort={{ key: "flags", direction: "asc" }}
    />
  );
}
