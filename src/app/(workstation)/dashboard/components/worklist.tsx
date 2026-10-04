import Link from "next/link";
import { FlagChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/state-panels";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { EncounterCell } from "@/components/shared/encounter-cell";
import { copy } from "@/lib/copy";
import type { Flag, WorklistItem } from "@/lib/api/types";
import { priorityOf } from "../lib/priority";
import { PriorityChip } from "./priority-chip";

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

const columns: Column<WorklistItem>[] = [
  {
    key: "name",
    header: "Patient",
    width: "24%",
    minWidth: "11rem",
    sortValue: (p) => p.name,
    cell: (p) => (
      <Link
        href={`/patients/${p.patient_id}`}
        className="group inline-flex items-center gap-2.5 text-foreground"
      >
        <PatientAvatar
          name={p.name}
          className="size-8 bg-muted text-[0.65rem] text-foreground/70"
        />
        <span className="min-w-0">
          <span className="block text-base font-semibold text-primary underline-offset-2 group-hover:underline">
            {p.name}
          </span>
          <span className="block text-xs text-muted-foreground tabular-nums">
            {p.age} · {p.sex}
          </span>
        </span>
      </Link>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    width: "14%",
    minWidth: "8rem",
    sortValue: urgency,
    cell: (p) => <PriorityChip priority={priorityOf(p)} />,
  },
  {
    key: "last",
    header: "Last encounter",
    width: "20%",
    minWidth: "9rem",
    sortValue: (p) => p.last_encounter.date ?? "",
    cell: (p) => <EncounterCell encounter={p.last_encounter} />,
  },
  {
    key: "flags",
    header: "Recent changes",
    minWidth: "11rem",
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
  if (items.length === 0)
    return (
      <div className="p-4">
        <EmptyState title={copy.empty.worklist} />
      </div>
    );
  return (
    <DataTable
      caption="Patients needing attention"
      columns={columns}
      rows={items}
      rowKey={(p) => p.patient_id}
      initialSort={{ key: "priority", direction: "asc" }}
      rowClassName={(p) =>
        priorityOf(p) === "high" ? "shadow-[inset_3px_0_0_var(--crit)]" : undefined
      }
      fill
      bare
    />
  );
}
