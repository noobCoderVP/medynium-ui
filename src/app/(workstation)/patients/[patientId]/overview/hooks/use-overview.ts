"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";

/** Same query key as the workspace header, so the patient is fetched once and shared. */
export function useOverview(patientId: string) {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => endpoints.patient(patientId),
  });
}
