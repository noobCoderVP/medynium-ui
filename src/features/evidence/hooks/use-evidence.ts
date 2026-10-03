"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { evidenceKeys, patientKeys } from "@/lib/api/keys";

/** One answer's evidence. It never changes once stored, so there is no refetch on focus. */
export function useEvidence(answerId: string | null) {
  return useQuery({
    queryKey: evidenceKeys.one(answerId ?? ""),
    queryFn: () => endpoints.evidence(answerId as string),
    enabled: Boolean(answerId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

export function usePins(patientId: string | null) {
  return useQuery({
    queryKey: patientKeys.pins(patientId ?? ""),
    queryFn: () => endpoints.pins(patientId as string),
    enabled: Boolean(patientId),
  });
}

/** Pins one evidence item. The server treats a repeat as the same pin (Idempotency-Key). */
export function usePinEvidence(patientId: string, answerId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (evidenceId: string) =>
      endpoints.addPin(patientId, { answer_id: answerId, evidence_id: evidenceId }),
    onSuccess: () => client.invalidateQueries({ queryKey: patientKeys.pins(patientId) }),
  });
}
