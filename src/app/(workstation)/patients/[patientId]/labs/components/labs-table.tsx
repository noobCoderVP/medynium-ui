import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { formatDate, formatValue } from "@/lib/format";
import type { LabLatest } from "@/lib/api/types";
import type { SortOrder } from "@/lib/use-list-state";

function range(lab: LabLatest): string {
  const { low, high } = lab.ref;
  if (low === null && high === null) return "–";
  if (low === null) return `up to ${formatValue(high)}`;
  if (high === null) return `${formatValue(low)} or more`;
  return `${formatValue(low)} to ${formatValue(high)}`;
}

export const LAB_SORTS = [
  { key: "test", label: "Test" },
  { key: "date", label: "Date" },
  { key: "value", label: "Latest value" },
];

export function LabsTable({
  rows,
  selected,
  onSelect,
  sort,
  onSort,
}: {
  rows: LabLatest[];
  selected: string;
  onSelect: (code: string) => void;
  sort: { key: string; order: SortOrder };
  onSort: (key: string) => void;
}) {
  const columns: Column<LabLatest>[] = [
    {
      key: "test",
      header: "Test",
      sortKey: "test",
      cell: (l) => (
        <Button
          variant="link"
          size="sm"
          aria-pressed={l.code === selected}
          aria-label={`Show trend for ${l.test}`}
          onClick={() => onSelect(l.code)}
          className="h-auto p-0 font-medium"
        >
          {l.test}
        </Button>
      ),
    },
    {
      key: "value",
      header: "Latest",
      sortKey: "value",
      align: "right",
      cell: (l) => <span className="font-medium">{formatValue(l.value, l.unit)}</span>,
    },
    { key: "date", header: "Date", sortKey: "date", cell: (l) => formatDate(l.date) },
    {
      key: "prev",
      header: "Previous",
      align: "right",
      cell: (l) =>
        l.previous ? (
          <span>
            {formatValue(l.previous.value, l.unit)}
            <span className="text-xs text-muted-foreground"> · {formatDate(l.previous.date)}</span>
          </span>
        ) : (
          "–"
        ),
    },
    { key: "ref", header: "Reference", cell: range },
    {
      key: "flag",
      header: "Flag",
      cell: (l) =>
        l.flag && l.flag !== "NORMAL" ? (
          <StatusChip tone="warn">{l.flag.toLowerCase()}</StatusChip>
        ) : (
          <span className="text-muted-foreground">Normal</span>
        ),
    },
  ];
  return (
    <DataTable
      caption="Latest result per test"
      columns={columns}
      rows={rows}
      rowKey={(l) => l.lab_id}
      sort={sort}
      onSort={onSort}
    />
  );
}
