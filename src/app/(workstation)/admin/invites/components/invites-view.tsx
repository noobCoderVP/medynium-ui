"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { EmptyState } from "@/components/shared/state-panels";
import { useInvites } from "../hooks/use-invites";
import { InviteForm } from "./invite-form";
import { InviteList } from "./invite-list";

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
        <DataState
          query={invites.list}
          skeleton={<SkeletonRows rows={3} />}
          isEmpty={(items) => items.length === 0}
          empty={<EmptyState title="No invites yet." />}
        >
          {(items) => (
            <InviteList
              items={items}
              busy={invites.revoke.isPending}
              onRevoke={(i) => invites.revoke.mutate(i.invite_id)}
            />
          )}
        </DataState>
      </section>
    </>
  );
}
