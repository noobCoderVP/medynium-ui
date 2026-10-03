"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

/** "Current" (default) or "all", held in ?status= so the view is linkable. */
export function useMedications(patientId: string) {
  const { params, update } = useUrlParams();
  const status = params.get("status") === "all" ? "all" : "active";
  const query = useQuery({
    queryKey: patientKeys.medications(patientId, status),
    queryFn: () => endpoints.medications(patientId, status),
  });
  return {
    query,
    status,
    setStatus: (value: "active" | "all") => update({ status: value === "all" ? "all" : null }),
  };
}
