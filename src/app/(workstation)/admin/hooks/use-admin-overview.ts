"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { adminKeys, knowledgeKeys } from "@/lib/api/keys";

/** Platform health (admin only), the corpus status the knowledge page also shows, and the latest golden run. */
export function useAdminOverview() {
  const health = useQuery({ queryKey: adminKeys.health, queryFn: endpoints.healthDetails });
  const corpus = useQuery({
    queryKey: knowledgeKeys.status,
    queryFn: endpoints.knowledgeStatus,
    staleTime: 5 * 60_000,
  });
  const golden = useQuery({ queryKey: adminKeys.golden, queryFn: endpoints.goldenRuns });
  return { health, corpus, golden };
}
