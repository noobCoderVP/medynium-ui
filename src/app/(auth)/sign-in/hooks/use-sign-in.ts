"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, isRateLimited } from "@/lib/api/errors";
import { endpoints } from "@/lib/api/endpoints";
import { sessionKeys } from "@/lib/api/keys";
import { copy } from "@/lib/copy";

export function useSignIn(next: string) {
  const router = useRouter();
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      endpoints.login(email, password),
    onSuccess: () => {
      client.removeQueries({ queryKey: sessionKeys.me });
      router.replace(next);
    },
  });

  const error = mutation.error;
  const message = !error
    ? null
    : isRateLimited(error)
      ? copy.auth.locked
      : error instanceof ApiError && error.status === 401
        ? copy.auth.signInError
        : error instanceof ApiError && error.status < 500
          ? error.message
          : copy.errors.network;

  return { signIn: mutation.mutate, pending: mutation.isPending, message };
}

/** The access cookie lasts 15 minutes; the refresh cookie lasts 7 days. Try to resume before showing the form. */
export function useResumeSession(next: string) {
  const router = useRouter();
  const [resuming, setResuming] = useState(true);
  useEffect(() => {
    let active = true;
    endpoints
      .refresh()
      .then(() => active && router.replace(next))
      .catch(() => active && setResuming(false));
    return () => {
      active = false;
    };
  }, [next, router]);
  return resuming;
}
