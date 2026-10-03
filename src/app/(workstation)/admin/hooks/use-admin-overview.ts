"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { adminKeys, knowledgeKeys } from "@/lib/api/keys";

/** Platform health (admin only) and the corpus status the knowledge page also shows. */
export function useAdminOverview() {
  const health = useQuery({ queryKey: adminKeys.health, queryFn: endpoints.healthDetails });
  const corpus = useQuery({
    queryKey: knowledgeKeys.status,
    queryFn: endpoints.knowledgeStatus,
    staleTime: 5 * 60_000,
  });
  return { health, corpus };
}
