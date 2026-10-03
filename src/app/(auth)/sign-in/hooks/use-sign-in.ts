"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, isRateLimited } from "@/lib/api/errors";
import { endpoints } from "@/lib/api/endpoints";
import { sessionKeys } from "@/lib/api/keys";
import type { OtpChallenge } from "@/lib/api/types";
import { copy } from "@/lib/copy";

function messageFor(error: unknown, otp: boolean): string | null {
  if (!error) return null;
  if (isRateLimited(error)) return copy.auth.locked;
  if (error instanceof ApiError && error.status === 401)
    return otp ? copy.auth.otpWrong : copy.auth.signInError;
  if (error instanceof ApiError && error.status === 503) return copy.auth.otpSendFailed;
  if (error instanceof ApiError && error.status < 500) return error.message;
  return copy.errors.network;
}

/**
 * Password step, then (only when the deployment asks for it) the six-digit code that was emailed. The API answers
 * the password step with either a session or a challenge; the challenge is held here and sent back with the code.
 */
export function useSignIn(next: string) {
  const router = useRouter();
  const client = useQueryClient();
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);

  const done = () => {
    client.removeQueries({ queryKey: sessionKeys.me });
    router.replace(next);
  };

  const password = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      endpoints.login(email, password),
    onSuccess: (result) => {
      if ("challenge" in result) setChallenge(result);
      else done();
    },
  });
  const code = useMutation({
    mutationFn: (value: string) => endpoints.verifyLogin(challenge?.challenge ?? "", value),
    onSuccess: done,
  });

  return {
    signIn: password.mutate,
    verify: code.mutate,
    challenge,
    cancel: () => {
      setChallenge(null);
      password.reset();
      code.reset();
    },
    pending: password.isPending || code.isPending,
    message: challenge ? messageFor(code.error, true) : messageFor(password.error, false),
  };
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
