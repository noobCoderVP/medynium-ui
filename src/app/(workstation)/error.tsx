"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/state-panels";

/** A screen crashed while rendering. The shell stays up so navigation still works. */
export default function WorkstationError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-lg pt-10">
      <ErrorState error={error} onRetry={retry} />
    </div>
  );
}
