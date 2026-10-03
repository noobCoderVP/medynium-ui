import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import type { StreamStep } from "@/lib/api/events";

/**
 * The real steps of a run (04), streamed as they happen. The list is a polite live region so a screen reader
 * hears progress without being interrupted; the answer itself is announced once, by its own region.
 */
export function StepsList({ steps }: { steps: StreamStep[] }) {
  if (steps.length === 0) return null;
  return (
    <ol aria-label="Steps" aria-live="polite" className="space-y-1.5 text-sm">
      {steps.map((step) => (
        <li key={step.step_id} className="flex items-start gap-2">
          {step.status === "running" ? (
            <Loader2
              className="mt-0.5 size-4 shrink-0 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : step.status === "failed" ? (
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-crit" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
          )}
          <span>
            {step.label}
            {step.detail ? <span className="text-muted-foreground">, {step.detail}</span> : null}
            <span className="sr-only"> ({step.status})</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
