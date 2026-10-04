"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { metricsKeys } from "@/lib/api/keys";

/** The assistant's own activity for the signed-in user over the last `days` days. */
export function useAiMetrics(days = 7) {
  return useQuery({
    queryKey: metricsKeys.ai(days),
    queryFn: () => endpoints.aiMetrics(days),
    staleTime: 30_000,
  });
}
