import { StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import type { UserItem } from "@/lib/api/types";
import type { SortOrder } from "@/lib/use-list-state";

interface Actions {
  onAccess: (user: UserItem) => void;
  onReset: (user: UserItem) => void;
  onToggle: (user: UserItem) => void;
  busy: boolean;
}

export const USER_SORTS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "last_login", label: "Last sign-in" },
  { key: "patients", label: "Patients" },
];

export function UsersTable({
  users,
  actions,
  sort,
  onSort,
}: {
  users: UserItem[];
  actions: Actions;
  sort: { key: string; order: SortOrder };
  onSort: (key: string) => void;
}) {
  const columns: Column<UserItem>[] = [
    {
      key: "name",
      header: "User",
      width: "28%",
      minWidth: "6rem",
      sortKey: "name",
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
      width: "14%",
      minWidth: "6rem",
      sortKey: "role",
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
      width: "14%",
      minWidth: "6rem",
      cell: (u) => (
        <StatusChip tone={u.status === "ACTIVE" ? "ok" : "muted"}>
          {u.status.toLowerCase()}
        </StatusChip>
      ),
    },
    {
      key: "patients",
      header: "Patients",
      width: "10%",
      minWidth: "6rem",
      align: "right",
      sortKey: "patients",
      cell: (u) => u.patient_count,
    },
    {
      key: "login",
      header: "Last sign-in",
      width: "16%",
      minWidth: "6rem",
      sortKey: "last_login",
      cell: (u) => formatDateTime(u.last_login_at),
    },
    {
      key: "actions",
      header: "Actions",
      width: "18%",
      minWidth: "6rem",
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
      sort={sort}
      onSort={onSort}
      fill
    />
  );
}
