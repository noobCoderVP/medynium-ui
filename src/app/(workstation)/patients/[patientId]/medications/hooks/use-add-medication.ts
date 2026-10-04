"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { endpoints } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { patientKeys, pendingKeys } from "@/lib/api/keys";
import type { MedicationIn } from "@/lib/api/types";

/**
 * Adds a medicine to the record (doctors). One idempotency key per dialog session, so a retry never adds it
 * twice. The list refreshes on success; summaries catch up in the background within seconds.
 */
export function useAddMedication(patientId: string) {
  const queryClient = useQueryClient();
  const key = useRef(crypto.randomUUID());
  const mutation = useMutation({
    mutationFn: (body: MedicationIn) => endpoints.addMedication(patientId, body, key.current),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
      void queryClient.invalidateQueries({ queryKey: ["patients", patientId, "medications"] });
      void queryClient.invalidateQueries({ queryKey: pendingKeys.all });
    },
  });
  return {
    add: mutation.mutate,
    pending: mutation.isPending,
    saved: mutation.isSuccess,
    message: mutation.error
      ? mutation.error instanceof ApiError
        ? mutation.error.status === 403
          ? "Only doctors can change the record."
          : mutation.error.message
        : "The medicine could not be saved."
      : null,
    reset: () => {
      mutation.reset();
      key.current = crypto.randomUUID();
    },
  };
}
