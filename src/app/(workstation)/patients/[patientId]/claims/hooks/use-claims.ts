"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

/** Claims and utilisation. ?claim=<id> marks the claim a timeline event pointed at. */
export function useClaims(patientId: string) {
  const { params } = useUrlParams();
  const query = useQuery({
    queryKey: patientKeys.claims(patientId),
    queryFn: () => endpoints.claims(patientId),
  });
  return { query, highlighted: params.get("claim") ?? undefined };
}
