"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/api/keys";
import type { InviteCreate } from "@/lib/api/types";
import { useListState } from "@/lib/use-list-state";

export function useInvites() {
  const client = useQueryClient();
  const state = useListState({
    filters: ["status", "kind"],
    defaultSort: "created",
    defaultOrder: "desc",
    defaultSize: 10,
  });
  const list = useQuery({
    queryKey: adminKeys.invitePage(state.apiParams),
    queryFn: () => endpoints.invites(state.apiParams),
    placeholderData: keepPreviousData,
  });
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
  return { ...state, list, doctors, create, revoke };
}
