"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { patientKeys } from "@/lib/api/keys";

/** The patient header's data. A denied patient and a missing one fail identically (404). */
export function usePatient(patientId: string) {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => endpoints.patient(patientId),
  });
}
