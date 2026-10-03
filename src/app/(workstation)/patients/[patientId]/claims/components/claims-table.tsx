import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { formatDate, formatMoney } from "@/lib/format";
import type { Claim } from "@/lib/api/types";

const tone = (status: string) =>
  status === "APPROVED" ? "ok" : status === "REJECTED" || status === "DENIED" ? "crit" : "warn";

const columns: Column<Claim>[] = [
  {
    key: "date",
    header: "Service date",
    sortValue: (c) => c.service_date ?? "",
    cell: (c) => formatDate(c.service_date),
  },
  { key: "service", header: "Service", cell: (c) => c.service ?? "–" },
  {
    key: "encounter",
    header: "Encounter",
    cell: (c) =>
      c.encounter_id ? <span className="font-mono text-xs">{c.encounter_id}</span> : "–",
  },
  {
    key: "status",
    header: "Status",
    sortValue: (c) => c.status,
    cell: (c) => <StatusChip tone={tone(c.status)}>{c.status.toLowerCase()}</StatusChip>,
  },
  {
    key: "billed",
    header: "Billed",
    align: "right",
    sortValue: (c) => c.billed.amount,
    cell: (c) => formatMoney(c.billed),
  },
  {
    key: "approved",
    header: "Approved",
    align: "right",
    sortValue: (c) => c.approved.amount,
    cell: (c) => formatMoney(c.approved),
  },
];

/** Each claim shows the encounter it belongs to. Amounts are INR with Indian grouping. */
export function ClaimsTable({ claims, highlighted }: { claims: Claim[]; highlighted?: string }) {
  return (
    <DataTable
      caption="Claims"
      columns={columns}
      rows={claims}
      rowKey={(c) => c.claim_id}
      highlightKey={highlighted}
      initialSort={{ key: "date", direction: "desc" }}
    />
  );
}
