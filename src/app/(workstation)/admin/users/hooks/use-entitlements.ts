"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { adminKeys, patientKeys } from "@/lib/api/keys";

/** The patients one user may see, and the patients the admin can choose from. */
export function useEntitlementEditor(userId: string, search: string) {
  const client = useQueryClient();
  const current = useQuery({
    queryKey: adminKeys.entitlements(userId),
    queryFn: () => endpoints.entitlements(userId),
  });
  const choices = useQuery({
    queryKey: [...patientKeys.all, "choices", search] as const,
    queryFn: () => endpoints.patients({ q: search, limit: 200 }),
  });
  const save = useMutation({
    mutationFn: (patientIds: string[]) => endpoints.setEntitlements(userId, patientIds),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: adminKeys.entitlements(userId) });
      return client.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
  return { current, choices, save };
}
