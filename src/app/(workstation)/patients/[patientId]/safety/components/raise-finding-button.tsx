"use client";

import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFindings } from "../hooks/use-findings";

/** Under a review conclusion: record it as a finding so a decision can be made and kept. Repeating is harmless. */
export function RaiseFindingButton({
  patientId,
  answerId,
  considerationId,
}: {
  patientId: string;
  answerId: string;
  considerationId: string;
}) {
  const { raise } = useFindings(patientId);
  if (raise.isSuccess) {
    return <p className="text-xs text-ok">Added to findings below. Record your decision there.</p>;
  }
  return (
    <div className="space-y-1">
      <Button
        size="sm"
        variant="outline"
        loading={raise.isPending}
        onClick={() => raise.mutate({ answer_id: answerId, consideration_id: considerationId })}
      >
        {raise.isPending ? null : <ClipboardCheck aria-hidden="true" />}
        {raise.isPending ? "Adding…" : "Add to findings"}
      </Button>
      {raise.isError ? (
        <p role="alert" className="text-xs text-crit">
          That did not save. Try again.
        </p>
      ) : null}
    </div>
  );
}
