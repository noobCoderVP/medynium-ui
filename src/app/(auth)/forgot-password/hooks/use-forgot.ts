"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiError, isRateLimited } from "@/lib/api/errors";
import { endpoints } from "@/lib/api/endpoints";
import { copy } from "@/lib/copy";

export function useForgotPassword() {
  const mutation = useMutation({ mutationFn: (email: string) => endpoints.forgotPassword(email) });
  const error = mutation.error;
  const message = !error
    ? null
    : isRateLimited(error)
      ? copy.auth.locked
      : error instanceof ApiError && error.status < 500
        ? error.message
        : copy.errors.network;
  return {
    request: mutation.mutate,
    pending: mutation.isPending,
    sent: mutation.isSuccess,
    message,
  };
}
