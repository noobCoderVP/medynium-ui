"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/errors";
import { endpoints } from "@/lib/api/endpoints";
import { copy } from "@/lib/copy";

export function useInvitePreview(token: string) {
  return useQuery({
    queryKey: ["invite", token],
    queryFn: () => endpoints.invitePreview(token),
    retry: false,
  });
}

export function useAcceptInvite(token: string) {
  const mutation = useMutation({
    mutationFn: ({ password, displayName }: { password: string; displayName?: string }) =>
      endpoints.acceptInvite(token, password, displayName),
  });
  const error = mutation.error;
  // Password-rule failures are the server's words (400); anything else is generic.
  const message = !error
    ? null
    : error instanceof ApiError && error.status === 404
      ? copy.auth.inviteInvalid
      : error instanceof ApiError && error.status < 500
        ? error.message
        : copy.errors.network;
  return {
    accept: mutation.mutate,
    pending: mutation.isPending,
    done: mutation.isSuccess,
    message,
  };
}
