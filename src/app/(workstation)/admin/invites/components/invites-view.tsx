"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { FilterField, ListToolbar } from "@/components/shared/list-toolbar";
import { PageHeading } from "@/components/shared/page-heading";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { useInvites } from "../hooks/use-invites";
import { InviteForm } from "./invite-form";
import { INVITE_SORTS, InviteList } from "./invite-list";

export function InvitesView() {
  const invites = useInvites();
  return (
    <>
      <PageHeading
        title="Invites"
        note="Invite a doctor or a clinic assistant. You share the link; they set their own password."
      />
      <InviteForm invites={invites} />
      <section aria-labelledby="invites-heading" className="space-y-2">
        <h2 id="invites-heading" className="text-sm font-semibold">
          Invites and reset links
        </h2>
        {invites.revoke.isError ? (
          <p role="alert" className="text-sm text-crit">
            That didn&apos;t revoke. Try again.
          </p>
        ) : null}
        <ListToolbar
          search={{ value: invites.text, onChange: invites.setText, label: "Search name or email" }}
          sort={{
            options: INVITE_SORTS,
            value: invites.sort,
            order: invites.order,
            onChange: invites.setSort,
          }}
          activeCount={invites.activeCount}
          onClear={invites.clear}
        >
          <FilterField
            label="Status"
            value={invites.filters.status}
            onChange={(v) => invites.setFilter("status", v)}
            anyLabel="Any status"
            options={["PENDING", "ACCEPTED", "REVOKED", "EXPIRED"].map((value) => ({
              value,
              label: value.charAt(0) + value.slice(1).toLowerCase(),
            }))}
          />
          <FilterField
            label="Type"
            value={invites.filters.kind}
            onChange={(v) => invites.setFilter("kind", v)}
            anyLabel="Any type"
            options={[
              { value: "INVITE", label: "Invite" },
              { value: "PASSWORD_RESET", label: "Password reset" },
            ]}
          />
        </ListToolbar>
        <DataState
          query={invites.list}
          skeleton={<SkeletonRows rows={3} />}
          isEmpty={(page) => page.total === 0}
          empty={<EmptyState title="No invites match." />}
        >
          {(page) => (
            <div className="space-y-3">
              <InviteList
                items={page.items}
                busy={invites.revoke.isPending}
                onRevoke={(i) => invites.revoke.mutate(i.invite_id)}
                sort={{ key: invites.sort, order: invites.order }}
                onSort={invites.toggleSort}
              />
              <Pagination
                noun="invites"
                total={page.total}
                offset={invites.offset}
                limit={invites.limit}
                onOffsetChange={invites.setOffset}
                onLimitChange={invites.setLimit}
              />
            </div>
          )}
        </DataState>
      </section>
    </>
  );
}
