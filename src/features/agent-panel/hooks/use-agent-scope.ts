"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";

/**
 * What the assistant can currently see: the open patient, by name once it is known. The name comes from the
 * same query the page uses, so it costs no extra request. The assistant never guesses which patient (05 principle 5).
 */
export function useAgentScope() {
  const { patientId } = useParams<{ patientId?: string }>();
  const patient = useQuery({
    queryKey: patientKeys.detail(patientId ?? ""),
    queryFn: () => endpoints.patient(patientId as string),
    enabled: Boolean(patientId),
  });
  return { patientId: patientId ?? null, name: patient.data?.name ?? null };
}
