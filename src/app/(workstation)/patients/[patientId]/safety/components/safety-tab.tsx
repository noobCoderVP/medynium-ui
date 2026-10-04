"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useSafetyReview } from "../hooks/use-safety-review";
import { FindingsCard } from "./findings-card";
import { PinsCard } from "./pins-card";
import { RunResult } from "./run-result";

/**
 * The manual safety review (U-10, FR-20). The assistant offers the same run, but this button works with the
 * panel collapsed or failing. Results are tagged statements with evidence buttons, or the honest gap.
 */
export function SafetyTab({ patientId }: { patientId: string }) {
  const { state, run } = useSafetyReview(patientId);
  const running = state.status === "running";
  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="space-y-3 pt-4">
          <div>
            <h2 className="text-base font-semibold">Safety review</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Checks this patient&apos;s current medicines against their results and the indexed
              drug labels. It highlights what may warrant clinician review. It does not diagnose or
              recommend treatment.
            </p>
          </div>
          <Button onClick={run} loading={running}>
            {running ? null : <ShieldCheck aria-hidden="true" />}
            {running ? "Running…" : state.status === "idle" ? "Run safety review" : "Run again"}
          </Button>
          <RunResult patientId={patientId} state={state} onRetry={run} />
        </CardBody>
      </Card>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <FindingsCard patientId={patientId} />
        <PinsCard patientId={patientId} />
      </div>
    </div>
  );
}
