"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { similarKeys } from "@/lib/api/keys";

/** Patients like this one among the signed-in clinician's own patients. Computed on the server; never padded. */
export function useSimilar(patientId: string) {
  return useQuery({
    queryKey: similarKeys.one(patientId),
    queryFn: () => endpoints.similar(patientId, { limit: 5 }),
    staleTime: 60_000,
  });
}
