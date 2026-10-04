"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { endpoints } from "@/lib/api/endpoints";
import { sessionKeys } from "@/lib/api/keys";

/** The signed-in user, their role and permissions. A 401 here sends the browser to sign-in (client.ts). */
export function useMe() {
  return useQuery({
    queryKey: sessionKeys.me,
    queryFn: endpoints.me,
    staleTime: 5 * 60_000,
  });
}

/** True only once we know the caller is a doctor; record changes and approvals are doctor-only (the API re-checks). */
export function useIsDoctor() {
  return useMe().data?.role === "DOCTOR";
}

/** Revokes the session, drops every cached read (including answers) and returns to sign-in. */
export function useSignOut() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: endpoints.logout,
    onSettled: () => {
      client.clear();
      router.replace("/sign-in");
    },
  });
}
