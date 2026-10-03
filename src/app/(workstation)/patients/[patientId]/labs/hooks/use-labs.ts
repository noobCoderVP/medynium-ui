"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

/** The latest result per test, plus the selected test's trend. The selection is ?lab=<code>. */
export function useLabs(patientId: string) {
  const { params, update } = useUrlParams();
  const code = params.get("lab") ?? "";
  const list = useQuery({
    queryKey: patientKeys.labs(patientId),
    queryFn: () => endpoints.labs(patientId),
  });
  const trend = useQuery({
    queryKey: patientKeys.trend(patientId, code),
    queryFn: () => endpoints.labTrend(patientId, code),
    enabled: Boolean(code),
  });
  return { list, trend, code, select: (next: string | null) => update({ lab: next }) };
}
