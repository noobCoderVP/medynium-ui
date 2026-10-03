import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { formatDate, formatMoney } from "@/lib/format";
import type { Claim } from "@/lib/api/types";
import type { SortOrder } from "@/lib/use-list-state";

const tone = (status: string) =>
  status === "APPROVED" ? "ok" : status === "REJECTED" || status === "DENIED" ? "crit" : "warn";

const columns: Column<Claim>[] = [
  {
    key: "date",
    header: "Service date",
    width: "14%",
    minWidth: "6rem",
    sortKey: "date",
    cell: (c) => formatDate(c.service_date),
  },
  {
    key: "service",
    header: "Service",
    width: "24%",
    minWidth: "6rem",
    cell: (c) => c.service ?? "–",
  },
  {
    key: "encounter",
    header: "Encounter",
    width: "20%",
    minWidth: "6rem",
    mobile: "secondary",
    cell: (c) =>
      c.encounter_id ? <span className="font-mono text-xs">{c.encounter_id}</span> : "–",
  },
  {
    key: "status",
    header: "Status",
    width: "14%",
    minWidth: "6rem",
    sortKey: "status",
    cell: (c) => <StatusChip tone={tone(c.status)}>{c.status.toLowerCase()}</StatusChip>,
  },
  {
    key: "billed",
    header: "Billed",
    width: "14%",
    minWidth: "6rem",
    align: "right",
    sortKey: "billed",
    cell: (c) => formatMoney(c.billed),
  },
  {
    key: "approved",
    header: "Approved",
    width: "14%",
    minWidth: "6rem",
    align: "right",
    sortKey: "approved",
    cell: (c) => formatMoney(c.approved),
  },
];

export const CLAIM_SORTS = [
  { key: "date", label: "Service date" },
  { key: "billed", label: "Billed" },
  { key: "approved", label: "Approved" },
  { key: "status", label: "Status" },
];

/** Each claim shows the encounter it belongs to. Amounts are INR with Indian grouping. */
export function ClaimsTable({
  claims,
  highlighted,
  sort,
  onSort,
}: {
  claims: Claim[];
  highlighted?: string;
  sort: { key: string; order: SortOrder };
  onSort: (key: string) => void;
}) {
  return (
    <DataTable
      caption="Claims"
      columns={columns}
      rows={claims}
      rowKey={(c) => c.claim_id}
      highlightKey={highlighted}
      sort={sort}
      onSort={onSort}
    />
  );
}
