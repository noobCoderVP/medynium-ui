"use client";

import { useState } from "react";
import { CopyLink } from "@/components/shared/copy-link";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { EmptyState } from "@/components/shared/state-panels";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import type { InviteCreated, UserItem } from "@/lib/api/types";
import { formatDateTime } from "@/lib/format";
import { useUsers } from "../hooks/use-users";
import { EntitlementsDialog } from "./entitlements-dialog";
import { UsersTable } from "./users-table";

export function UsersView() {
  const u = useUsers();
  const [access, setAccess] = useState<UserItem | null>(null);
  const [link, setLink] = useState<InviteCreated | null>(null);
  const [text, setText] = useState(u.q);

  return (
    <>
      <PageHeading
        title="Users and access"
        note="Disable accounts, set who sees which patients, and issue password-reset links."
      />
      <form
        role="search"
        aria-label="Find a user"
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          u.setQ(text);
        }}
      >
        <div className="space-y-1">
          <label htmlFor="user-q" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="user-q"
            className="w-64"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Name or email"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="user-status" className="text-sm font-medium">
            Status
          </label>
          <Select
            id="user-status"
            className="w-40"
            value={u.status}
            onChange={(e) => u.setStatusFilter(e.target.value)}
          >
            <option value="">Any status</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </Select>
        </div>
      </form>
      {u.setStatus.isError || u.reset.isError ? (
        <p role="alert" className="text-sm text-crit">
          That change didn&apos;t go through. Try again.
        </p>
      ) : null}
      <DataState
        query={u.query}
        skeleton={<SkeletonRows rows={4} />}
        isEmpty={(p) => p.items.length === 0}
        empty={<EmptyState title="No users match." />}
      >
        {(page) => (
          <UsersTable
            users={page.items}
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
              Expires {formatDateTime(link.expires_at)}. Anyone with the link can set the password,
              so send it privately.
            </p>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
