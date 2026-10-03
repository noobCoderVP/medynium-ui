"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { adminKeys } from "@/lib/api/keys";
import { useListState } from "@/lib/use-list-state";

/** Users, searched, filtered, sorted and paged by the API (state in the URL), plus disable/enable and reset. */
export function useUsers() {
  const list = useListState({
    filters: ["role", "status"],
    defaultSort: "name",
    defaultOrder: "asc",
    defaultSize: 10,
  });
  const client = useQueryClient();

  const query = useQuery({
    queryKey: adminKeys.users(list.apiParams),
    queryFn: () => endpoints.users(list.apiParams),
    placeholderData: keepPreviousData,
  });
  const setStatus = useMutation({
    mutationFn: ({ id, next }: { id: string; next: "ACTIVE" | "DISABLED" }) =>
      endpoints.patchUser(id, { status: next }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
  const reset = useMutation({ mutationFn: (id: string) => endpoints.resetPassword(id) });

  return { ...list, query, setStatus, reset };
}
