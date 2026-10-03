"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/api/keys";
import type { InviteCreate } from "@/lib/api/types";

export function useInvites() {
  const client = useQueryClient();
  const list = useQuery({ queryKey: adminKeys.invites, queryFn: endpoints.invites });
  const doctors = useQuery({
    queryKey: ["admin", "users", "doctors"] as const,
    queryFn: () => endpoints.users({ role: "DOCTOR", status: "ACTIVE", limit: 100 }),
  });
  const create = useMutation({
    mutationFn: (body: InviteCreate) => endpoints.createInvite(body),
    onSuccess: () => client.invalidateQueries({ queryKey: adminKeys.invites }),
  });
  const revoke = useMutation({
    mutationFn: (id: string) => endpoints.revokeInvite(id),
    onSuccess: () => client.invalidateQueries({ queryKey: adminKeys.invites }),
  });
  return { list, doctors, create, revoke };
}
