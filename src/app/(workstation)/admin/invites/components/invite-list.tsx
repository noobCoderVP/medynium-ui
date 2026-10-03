import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import type { InviteItem } from "@/lib/api/types";
import type { SortOrder } from "@/lib/use-list-state";

export const INVITE_SORTS = [
  { key: "created", label: "Created" },
  { key: "expires", label: "Expires" },
  { key: "email", label: "Email" },
];

export function InviteList({
  items,
  onRevoke,
  busy,
  sort,
  onSort,
}: {
  items: InviteItem[];
  onRevoke: (invite: InviteItem) => void;
  busy: boolean;
  sort: { key: string; order: SortOrder };
  onSort: (key: string) => void;
}) {
  const columns: Column<InviteItem>[] = [
    {
      key: "who",
      header: "Invitee",
      width: "30%",
      minWidth: "6rem",
      sortKey: "email",
      cell: (i) => (
        <div>
          <p className="font-medium">{i.display_name}</p>
          <p className="text-xs text-muted-foreground">{i.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "14%",
      minWidth: "6rem",
      cell: (i) => (i.role === "DOCTOR" ? "Doctor" : "Clinic assistant"),
    },
    {
      key: "kind",
      header: "Type",
      width: "14%",
      minWidth: "6rem",
      cell: (i) => (i.kind === "PASSWORD_RESET" ? "Password reset" : "Invite"),
    },
    {
      key: "status",
      header: "Status",
      width: "14%",
      minWidth: "6rem",
      cell: (i) => (
        <StatusChip tone={i.status === "PENDING" ? "warn" : "muted"}>
          {i.status.toLowerCase()}
        </StatusChip>
      ),
    },
    {
      key: "expires",
      header: "Expires",
      width: "14%",
      minWidth: "6rem",
      sortKey: "expires",
      cell: (i) => formatDateTime(i.expires_at),
    },
    {
      key: "actions",
      header: "Actions",
      width: "14%",
      minWidth: "6rem",
      cell: (i) =>
        i.status === "PENDING" ? (
          <Button
            variant="outline"
            size="xs"
            disabled={busy}
            onClick={() => onRevoke(i)}
            aria-label={`Revoke invite for ${i.display_name}`}
          >
            Revoke
          </Button>
        ) : null,
    },
  ];
  return (
    <DataTable
      caption="Invites"
      columns={columns}
      rows={items}
      rowKey={(i) => i.invite_id}
      sort={sort}
      onSort={onSort}
    />
  );
}
