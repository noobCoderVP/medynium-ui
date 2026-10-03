import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import type { InviteItem } from "@/lib/api/types";

export function InviteList({
  items,
  onRevoke,
  busy,
}: {
  items: InviteItem[];
  onRevoke: (invite: InviteItem) => void;
  busy: boolean;
}) {
  const columns: Column<InviteItem>[] = [
    {
      key: "who",
      header: "Invitee",
      sortValue: (i) => i.display_name,
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
      cell: (i) => (i.role === "DOCTOR" ? "Doctor" : "Clinic assistant"),
    },
    {
      key: "kind",
      header: "Type",
      cell: (i) => (i.kind === "PASSWORD_RESET" ? "Password reset" : "Invite"),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (i) => i.status,
      cell: (i) => (
        <StatusChip tone={i.status === "PENDING" ? "warn" : "muted"}>
          {i.status.toLowerCase()}
        </StatusChip>
      ),
    },
    {
      key: "expires",
      header: "Expires",
      sortValue: (i) => i.expires_at,
      cell: (i) => formatDateTime(i.expires_at),
    },
    {
      key: "actions",
      header: "Actions",
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
      initialSort={{ key: "expires", direction: "desc" }}
    />
  );
}
