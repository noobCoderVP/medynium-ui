"use client";

import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { ApiError, isRateLimited } from "@/lib/api/errors";
import type { ShareRequest } from "@/lib/api/types";
import { copy } from "@/lib/copy";

/** Email a summary of this patient to one recipient. The API checks access, sends through Resend and audits it. */
export function useSharePatient(patientId: string) {
  const mutation = useMutation({
    mutationFn: (body: ShareRequest) => endpoints.sharePatient(patientId, body),
  });
  const error = mutation.error;
  const message = !error
    ? null
    : isRateLimited(error)
      ? "You have sent several emails in a row. Wait a minute and try again."
      : error instanceof ApiError && error.status === 503
        ? "The email could not be sent. Email may not be set up yet; ask your administrator."
        : error instanceof ApiError && error.status === 422
          ? "Check the email address."
          : error instanceof ApiError && error.status < 500
            ? error.message
            : copy.errors.network;
  return {
    send: mutation.mutate,
    pending: mutation.isPending,
    sent: mutation.isSuccess,
    message,
    reset: mutation.reset,
  };
}
