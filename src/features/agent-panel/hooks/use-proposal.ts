"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { endpoints } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";

export type ProposalState =
  | { phase: "idle" }
  | { phase: "saving" }
  | { phase: "saved"; href: string; updating: boolean }
  | { phase: "discarded" }
  | { phase: "failed"; message: string };

const POLL_MS = 2000;
const MAX_POLLS = 30;

async function waitForRebuild(patientId: string): Promise<void> {
  for (let i = 0; i < MAX_POLLS; i++) {
    try {
      if (!(await endpoints.syncStatus(patientId)).pending) return;
    } catch {
      return; // the screens refresh anyway; never leave the card waiting on a status check
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
}

/**
 * Approve or discard one prepared change. Approving calls the same service the manual screens use, as the signed-in
 * clinician; on success every cached patient query is refreshed so the new record shows at once.
 */
export function useProposal(proposalId: string) {
  const [state, setState] = useState<ProposalState>({ phase: "idle" });
  const client = useQueryClient();

  const approve = async () => {
    setState({ phase: "saving" });
    try {
      const done = await endpoints.approveProposal(proposalId);
      const tab = done.tab === "overview" ? "" : `?tab=${encodeURIComponent(done.tab)}`;
      const href = `/patients/${encodeURIComponent(done.patient_id)}${tab}`;
      setState({ phase: "saved", href, updating: true });
      // The screens are rebuilt in the background after a write; refreshing them mid-rebuild would show a partial
      // record, so wait for the rebuild first (as long as a minute), then refresh everything.
      await waitForRebuild(done.patient_id);
      await client.invalidateQueries();
      setState({ phase: "saved", href, updating: false });
    } catch (error) {
      const api = error instanceof ApiError ? error : null;
      setState({
        phase: "failed",
        message:
          api?.code === "not_found"
            ? "This prepared change has expired. Ask again to prepare it."
            : (api?.message ?? "The change could not be saved."),
      });
    }
  };

  const discard = async () => {
    setState({ phase: "saving" });
    try {
      await endpoints.discardProposal(proposalId);
    } catch {
      // An expired proposal is already gone; the card closes either way.
    }
    setState({ phase: "discarded" });
  };

  return { state, approve, discard };
}
