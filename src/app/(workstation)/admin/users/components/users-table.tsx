import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import type { UserItem } from "@/lib/api/types";

interface Actions {
  onAccess: (user: UserItem) => void;
  onReset: (user: UserItem) => void;
  onToggle: (user: UserItem) => void;
  busy: boolean;
}

export function UsersTable({ users, actions }: { users: UserItem[]; actions: Actions }) {
  const columns: Column<UserItem>[] = [
    {
      key: "name",
      header: "User",
      sortValue: (u) => u.display_name,
      cell: (u) => (
        <div>
          <p className="font-medium">{u.display_name}</p>
          <p className="text-xs text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortValue: (u) => u.role,
      cell: (u) => (
        <span>
          {u.role === "DOCTOR" ? "Doctor" : "Clinic assistant"}
          {u.is_admin ? <span className="text-muted-foreground"> · Admin</span> : null}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (u) => u.status,
      cell: (u) => (
        <StatusChip tone={u.status === "ACTIVE" ? "ok" : "muted"}>
          {u.status.toLowerCase()}
        </StatusChip>
      ),
    },
    {
      key: "patients",
      header: "Patients",
      align: "right",
      sortValue: (u) => u.patient_count,
      cell: (u) => u.patient_count,
    },
    {
      key: "login",
      header: "Last sign-in",
      sortValue: (u) => u.last_login_at ?? "",
      cell: (u) => formatDateTime(u.last_login_at),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (u) => (
        <div className="flex flex-wrap gap-1">
          <Button
            variant="outline"
            size="xs"
            onClick={() => actions.onAccess(u)}
            aria-label={`Edit access for ${u.display_name}`}
          >
            Access
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => actions.onReset(u)}
            disabled={actions.busy}
            aria-label={`Reset password for ${u.display_name}`}
          >
            Reset password
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => actions.onToggle(u)}
            disabled={actions.busy}
            aria-label={`${u.status === "ACTIVE" ? "Disable" : "Enable"} ${u.display_name}`}
          >
            {u.status === "ACTIVE" ? "Disable" : "Enable"}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      caption="Users"
      columns={columns}
      rows={users}
      rowKey={(u) => u.user_id}
      initialSort={{ key: "name", direction: "asc" }}
    />
  );
}
