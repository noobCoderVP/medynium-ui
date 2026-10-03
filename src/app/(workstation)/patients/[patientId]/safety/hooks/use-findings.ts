"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import type { FindingUpdate } from "@/lib/api/types";

/** The decisions recorded on this patient's review statements, and the two things a user can do to them. */
export function useFindings(patientId: string) {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: patientKeys.findings(patientId),
    queryFn: () => endpoints.findings(patientId),
  });
  const refresh = () => client.invalidateQueries({ queryKey: patientKeys.findings(patientId) });
  const raise = useMutation({
    mutationFn: (body: { answer_id: string; consideration_id: string }) =>
      endpoints.raiseFinding(patientId, body),
    onSuccess: refresh,
  });
  const decide = useMutation({
    mutationFn: (args: { findingId: string; body: FindingUpdate }) =>
      endpoints.decideFinding(args.findingId, args.body),
    onSuccess: refresh,
  });
  return { query, raise, decide };
}

/** Colleagues who have this patient, fetched only when someone is choosing an escalation target. */
export function useColleagues(patientId: string, enabled: boolean) {
  return useQuery({
    queryKey: patientKeys.colleagues(patientId),
    queryFn: () => endpoints.colleagues(patientId),
    enabled,
  });
}
