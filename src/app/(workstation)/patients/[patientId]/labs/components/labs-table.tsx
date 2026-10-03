import { ChangeChip, StatusChip, type ChangeKind } from "@/components/shared/chips";
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

/** Which way the latest value moved from the previous one; null when there is nothing to compare. */
export function labChange(lab: LabLatest): ChangeKind | null {
  if (!lab.previous) return null;
  if (lab.value > lab.previous.value) return "increased";
  if (lab.value < lab.previous.value) return "decreased";
  return null;
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
    {
      key: "change",
      header: "Change",
      cell: (l) => {
        const kind = labChange(l);
        return kind ? (
          <ChangeChip kind={kind} />
        ) : (
          <span className="text-muted-foreground">{l.previous ? "No change" : "–"}</span>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      sortKey: "date",
      mobile: "secondary",
      cell: (l) => formatDate(l.date),
    },
    {
      key: "prev",
      header: "Previous",
      align: "right",
      mobile: "secondary",
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
    { key: "ref", header: "Reference", mobile: "secondary", cell: range },
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
