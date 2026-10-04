"use client";

import { useState } from "react";
import { CopyLink } from "@/components/shared/copy-link";
import { DataState } from "@/components/shared/data-state";
import { FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { PageHeading } from "@/components/shared/page-heading";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { Dialog } from "@/components/ui/dialog";
import type { InviteCreated, UserItem } from "@/lib/api/types";
import { formatDateTime } from "@/lib/format";
import { useUsers } from "../hooks/use-users";
import { EntitlementsDialog } from "./entitlements-dialog";
import { USER_SORTS, UsersTable } from "./users-table";

export function UsersView() {
  const u = useUsers();
  const [access, setAccess] = useState<UserItem | null>(null);
  const [link, setLink] = useState<InviteCreated | null>(null);

  return (
    <div data-fit className="flex flex-col gap-4 lg:min-h-0 lg:flex-1">
      <PageHeading
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Users and access" }]}
        title="Users and access"
        note="Disable accounts, set who sees which patients, and issue password-reset links."
      />
      <ListToolbar
        search={{ value: u.text, onChange: u.setText, label: "Search name or email" }}
        sort={{ options: USER_SORTS, value: u.sort, order: u.order, onChange: u.setSort }}
        activeCount={u.activeCount}
        onClear={u.clear}
      >
        <FilterField
          label="Role"
          value={u.filters.role}
          onChange={(v) => u.setFilter("role", v)}
          anyLabel="Any role"
          options={[
            { value: "DOCTOR", label: "Doctor" },
            { value: "ASSISTANT", label: "Clinic assistant" },
          ]}
        />
        <FilterField
          label="Status"
          value={u.filters.status}
          onChange={(v) => u.setFilter("status", v)}
          anyLabel="Any status"
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "DISABLED", label: "Disabled" },
          ]}
        />
      </ListToolbar>
      {u.setStatus.isError || u.reset.isError ? (
        <p role="alert" className="text-sm text-crit">
          That change didn&apos;t go through. Try again.
        </p>
      ) : null}
      <DataState
        query={u.query}
        isEmpty={(p) => p.total === 0}
        empty={<EmptyState title="No users match." />}
      >
        {(page) => (
          <div className="flex min-h-0 flex-col gap-3 lg:flex-1">
            <div className="min-h-0">
              <UsersTable
                users={page.items}
                sort={{ key: u.sort, order: u.order }}
                onSort={u.toggleSort}
                actions={{
                  busy: u.setStatus.isPending || u.reset.isPending,
                  onAccess: setAccess,
                  onToggle: (user) =>
                    u.setStatus.mutate({
                      id: user.user_id,
                      next: user.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
                    }),
                  onReset: (user) => u.reset.mutate(user.user_id, { onSuccess: setLink }),
                }}
              />
            </div>
            <Pagination
              noun="users"
              total={page.total}
              offset={u.offset}
              limit={u.limit}
              onOffsetChange={u.setOffset}
              onLimitChange={u.setLimit}
            />
          </div>
        )}
      </DataState>
      <EntitlementsDialog user={access} onClose={() => setAccess(null)} />
      <Dialog
        open={link !== null}
        onOpenChange={(open) => !open && setLink(null)}
        title="Password reset link"
        description="Share this link with the user. It works once."
      >
        {link ? (
          <div className="space-y-2 p-4">
            <CopyLink label="Reset link" url={link.accept_url} />
            <p className="text-xs text-muted-foreground">
              Expires {formatDateTime(link.expires_at)}.{" "}
              {link.email_sent
                ? `We also emailed it to ${link.email}.`
                : "Email is not configured, so share it yourself."}{" "}
              Anyone with the link can set the password, so send it privately.
            </p>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
