"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

/**
 * Date range and event types live in the URL (?from=&to=&types=), so a filtered timeline is linkable and the
 * assistant's "show timeline" action only has to set these params (06 section 3).
 */
export function useTimeline(patientId: string) {
  const { params, update } = useUrlParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const types = params.get("types") ?? "";
  const query = useQuery({
    queryKey: patientKeys.timeline(patientId, from, to, types),
    queryFn: () => endpoints.timeline(patientId, { from, to, types }),
  });
  return {
    query,
    from,
    to,
    selectedTypes: types ? types.split(",") : [],
    setRange: (next: { from?: string; to?: string }) =>
      update({ from: next.from ?? from, to: next.to ?? to }),
    setTypes: (next: string[]) => update({ types: next.join(",") || null }),
    clear: () => update({ from: null, to: null, types: null }),
  };
}
