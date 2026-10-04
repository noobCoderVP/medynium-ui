import { DoctorLine } from "@/components/shared/doctor-line";
import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { formatDate } from "@/lib/format";
import type { Medication } from "@/lib/api/types";
import type { SortOrder } from "@/lib/use-list-state";

const columns: Column<Medication>[] = [
  {
    key: "drug",
    header: "Medicine",
    width: "20%",
    minWidth: "6rem",
    sortKey: "drug",
    cell: (m) => (
      <div>
        <p className="font-medium">{m.drug}</p>
        {m.description ? <p className="text-xs text-muted-foreground">{m.description}</p> : null}
        {m.also_sold_as.length > 0 ? (
          <p className="text-xs text-muted-foreground">Also sold as {m.also_sold_as.join(", ")}</p>
        ) : null}
      </div>
    ),
  },
  {
    key: "dose",
    header: "Dose",
    width: "10%",
    minWidth: "6rem",
    cell: (m) => m.dose ?? m.strength ?? "–",
  },
  {
    key: "started",
    header: "Started",
    width: "11%",
    minWidth: "6rem",
    sortKey: "started",
    mobile: "secondary",
    cell: (m) => formatDate(m.started),
  },
  {
    key: "stopped",
    header: "Stopped",
    width: "11%",
    minWidth: "6rem",
    cell: (m) => (m.stopped ? formatDate(m.stopped) : <StatusChip tone="ok">current</StatusChip>),
  },
  {
    key: "change",
    header: "Last change",
    width: "16%",
    minWidth: "6rem",
    sortKey: "last_change",
    cell: (m) =>
      m.change ? (
        <span>
          {m.change}
          {m.last_change_date ? (
            <span className="text-muted-foreground"> · {formatDate(m.last_change_date)}</span>
          ) : null}
        </span>
      ) : (
        <span className="text-muted-foreground">None recorded</span>
      ),
  },
  {
    key: "doctor",
    header: "Doctor",
    width: "16%",
    minWidth: "6rem",
    mobile: "secondary",
    cell: (m) => (m.doctor ? <DoctorLine doctor={m.doctor} /> : "–"),
  },
  {
    key: "label",
    header: "Label",
    width: "12%",
    minWidth: "6rem",
    mobile: "secondary",
    cell: (m) =>
      m.in_knowledge_base ? (
        <StatusChip tone="ok">indexed</StatusChip>
      ) : (
        <StatusChip tone="muted">not indexed</StatusChip>
      ),
  },
];

/** Dose, start, change note and whether the drug's label is in the knowledge corpus. */
export const MEDICATION_SORTS = [
  { key: "started", label: "Start date" },
  { key: "drug", label: "Medicine" },
  { key: "last_change", label: "Last change" },
];

export function MedicationsTable({
  rows,
  sort,
  onSort,
}: {
  rows: Medication[];
  sort: { key: string; order: SortOrder };
  onSort: (key: string) => void;
}) {
  return (
    <DataTable
      fill
      caption="Medications"
      columns={columns}
      rows={rows}
      rowKey={(m) => m.medication_id}
      sort={sort}
      onSort={onSort}
    />
  );
}
