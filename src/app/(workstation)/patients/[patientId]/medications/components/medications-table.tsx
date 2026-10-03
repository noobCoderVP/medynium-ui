import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { formatDate } from "@/lib/format";
import type { Medication } from "@/lib/api/types";
import type { SortOrder } from "@/lib/use-list-state";

const columns: Column<Medication>[] = [
  {
    key: "drug",
    header: "Medicine",
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
  { key: "dose", header: "Dose", cell: (m) => m.dose ?? m.strength ?? "–" },
  {
    key: "started",
    header: "Started",
    sortKey: "started",
    mobile: "secondary",
    cell: (m) => formatDate(m.started),
  },
  {
    key: "stopped",
    header: "Stopped",
    cell: (m) => (m.stopped ? formatDate(m.stopped) : <StatusChip tone="ok">current</StatusChip>),
  },
  {
    key: "change",
    header: "Last change",
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
    key: "label",
    header: "Label",
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
    <div className="space-y-2">
      <DataTable
        caption="Medications"
        columns={columns}
        rows={rows}
        rowKey={(m) => m.medication_id}
        sort={sort}
        onSort={onSort}
      />
      <p className="text-xs text-muted-foreground">
        Source: <span className="font-mono">CLINICAL.MEDICATION</span>. &quot;Not indexed&quot;
        means the safety review has no label text for that medicine and will say so.
      </p>
    </div>
  );
}
