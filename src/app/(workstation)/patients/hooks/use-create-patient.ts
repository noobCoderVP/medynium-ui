"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { endpoints } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { patientKeys, pendingKeys } from "@/lib/api/keys";
import type { PatientCreate } from "@/lib/api/types";

/**
 * Registers a patient. One idempotency key per dialog session, so a double click or a retry after a dropped
 * connection returns the first patient instead of making a second one.
 */
export function useCreatePatient() {
  const queryClient = useQueryClient();
  const key = useRef(crypto.randomUUID());
  const mutation = useMutation({
    mutationFn: (body: PatientCreate) => endpoints.createPatient(body, key.current),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientKeys.all });
      void queryClient.invalidateQueries({ queryKey: pendingKeys.all });
    },
  });
  const error = mutation.error;
  /** A 409 on a possible duplicate carries the reason in its message; the form offers to confirm. */
  const duplicate = error instanceof ApiError && error.status === 409;
  return {
    create: mutation.mutate,
    pending: mutation.isPending,
    created: mutation.data,
    duplicate,
    message: error
      ? error instanceof ApiError
        ? error.message
        : "The patient could not be saved."
      : null,
    reset: () => {
      mutation.reset();
      key.current = crypto.randomUUID();
    },
  };
}
