import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { StatusChip, type ChangeKind } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { formatDate, formatShortDate, formatValue } from "@/lib/format";
import type { LabLatest } from "@/lib/api/types";
import type { SortOrder } from "@/lib/use-list-state";
import { cn } from "@/lib/utils";
import { isAbnormal } from "../lib/summary";

/** Muted reference range with an en dash; the symbols are hidden from screen readers, which get words instead. */
function Range({ lab }: { lab: LabLatest }) {
  const { low, high } = lab.ref;
  if (low === null && high === null) return <span className="text-muted-foreground">–</span>;
  const [visible, spoken] =
    low === null
      ? [`≤ ${formatValue(high)}`, `up to ${formatValue(high)}`]
      : high === null
        ? [`≥ ${formatValue(low)}`, `${formatValue(low)} or more`]
        : [
            `${formatValue(low)}–${formatValue(high)}`,
            `${formatValue(low)} to ${formatValue(high)}`,
          ];
  return (
    <span className="text-muted-foreground tabular-nums">
      <span aria-hidden="true">{visible}</span>
      <span className="sr-only">{spoken}</span>
    </span>
  );
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
      width: "26%",
      minWidth: "7rem",
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
      width: "17%",
      minWidth: "7rem",
      sortKey: "value",
      align: "right",
      cell: (l) => (
        <span className={cn("tabular-nums", isAbnormal(l) ? "font-bold text-crit" : "font-medium")}>
          {formatValue(l.value, l.unit)}
        </span>
      ),
    },
    {
      key: "trend",
      header: "Trend",
      width: "15%",
      minWidth: "6rem",
      cell: (l) => {
        const kind = labChange(l);
        if (!l.previous) return <span className="text-muted-foreground">–</span>;
        const Icon = kind === "increased" ? ArrowUp : kind === "decreased" ? ArrowDown : Minus;
        const word =
          kind === "increased" ? "Increased" : kind === "decreased" ? "Decreased" : "No change";
        return (
          <span className="inline-flex flex-col leading-tight tabular-nums">
            <span className="inline-flex items-center gap-1">
              <Icon className="size-3.5" aria-hidden="true" />
              <span className="sr-only">{word} from </span>
              {formatValue(l.previous.value)}
            </span>
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              {formatShortDate(l.previous.date)}
            </span>
          </span>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      width: "15%",
      minWidth: "7rem",
      sortKey: "date",
      mobile: "secondary",
      cell: (l) => <span className="whitespace-nowrap tabular-nums">{formatDate(l.date)}</span>,
    },
    {
      key: "ref",
      header: "Reference",
      width: "15%",
      minWidth: "6rem",
      mobile: "secondary",
      cell: (l) => <Range lab={l} />,
    },
    {
      key: "flag",
      header: "Flag",
      width: "12%",
      minWidth: "5rem",
      cell: (l) =>
        l.flag && l.flag !== "NORMAL" ? (
          <StatusChip tone="crit">{l.flag === "HIGH" ? "High" : "Low"}</StatusChip>
        ) : (
          <span className="sr-only">Normal</span>
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
