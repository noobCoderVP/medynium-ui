"use client";

import { usePinEvidence, usePins } from "./use-evidence";

/** Pin state for the items in one answer's evidence. No pin button when the answer has no patient. */
export function useEvidencePins(patientId: string | null, answerId: string) {
  const pins = usePins(patientId);
  const add = usePinEvidence(patientId ?? "", answerId);
  const pinned = new Set(
    (pins.data?.items ?? []).filter((p) => p.answer_id === answerId).map((p) => p.evidence_id),
  );
  return {
    isPinned: (evidenceId: string) => pinned.has(evidenceId),
    pinFor: (evidenceId: string) => (patientId ? () => add.mutate(evidenceId) : undefined),
  };
}
