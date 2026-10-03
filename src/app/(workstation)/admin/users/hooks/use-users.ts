"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

/** Users, with search and status in the URL, plus disable/enable and password reset. */
export function useUsers() {
  const { params, update } = useUrlParams();
  const q = params.get("q") ?? "";
  const status = params.get("status") ?? "";
  const client = useQueryClient();

  const query = useQuery({
    queryKey: adminKeys.users(q, status),
    queryFn: () => endpoints.users({ q, status: status || undefined, limit: 100 }),
    placeholderData: keepPreviousData,
  });
  const setStatus = useMutation({
    mutationFn: ({ id, next }: { id: string; next: "ACTIVE" | "DISABLED" }) =>
      endpoints.patchUser(id, { status: next }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
  const reset = useMutation({ mutationFn: (id: string) => endpoints.resetPassword(id) });

  return {
    query,
    q,
    status,
    setQ: (value: string) => update({ q: value.trim() || null }),
    setStatusFilter: (value: string) => update({ status: value || null }),
    setStatus,
    reset,
  };
}
