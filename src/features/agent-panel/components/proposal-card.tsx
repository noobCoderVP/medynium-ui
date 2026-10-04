"use client";

import { ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { StreamProposal } from "@/lib/api/events";
import { useProposal } from "../hooks/use-proposal";

/**
 * A change the assistant prepared. Nothing is saved until the clinician approves it here; Approve calls the same
 * service the manual screens use, as the signed-in clinician (AI-10, SEC-12).
 */
export function ProposalCard({ proposal }: { proposal: StreamProposal }) {
  const { state, approve, discard } = useProposal(proposal.proposal_id);

  return (
    <section
      aria-label="Change for your approval"
      className="space-y-2 rounded-lg border border-agent/40 bg-agent-soft/40 p-3"
    >
      <p className="flex items-center gap-2 text-sm font-medium">
        <ClipboardCheck className="size-4 text-agent" aria-hidden="true" />
        {proposal.title}
      </p>
      <dl className="space-y-1 text-sm">
        {proposal.fields.map((f) => (
          <div key={f.label} className="grid grid-cols-[7rem_1fr] gap-2">
            <dt className="text-muted-foreground">{f.label}</dt>
            <dd className="break-words">{f.value}</dd>
          </div>
        ))}
      </dl>
      {state.phase === "saved" ? (
        <p className="text-sm" role="status">
          Saved to the record.{state.updating ? " Updating the screens…" : ""}{" "}
          <Link href={state.href} className="font-medium text-primary underline">
            Open
          </Link>
        </p>
      ) : state.phase === "discarded" ? (
        <p className="text-sm text-muted-foreground" role="status">
          Discarded. Nothing was saved.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Nothing is saved until you approve. You can also make this change yourself on the
            patient screen.
          </p>
          {state.phase === "failed" ? (
            <p role="alert" className="text-sm text-crit">
              {state.message}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button size="sm" onClick={approve} disabled={state.phase === "saving"}>
              Approve and save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={discard}
              disabled={state.phase === "saving"}
            >
              Discard
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
