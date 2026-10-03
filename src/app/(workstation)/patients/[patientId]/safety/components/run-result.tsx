import { AgentUnavailable, RateLimited } from "@/components/shared/state-panels";
import { StepsList } from "@/components/shared/steps-list";
import { AnswerView } from "@/features/evidence";
import { copy } from "@/lib/copy";
import type { RunState } from "../hooks/use-safety-review";

/**
 * The result of a manual run: live steps while running, then the tagged answer; or, on failure, an honest
 * message. A failed or unavailable assistant leaves the rest of the patient record fully usable.
 */
export function RunResult({ state, onRetry }: { state: RunState; onRetry: () => void }) {
  if (state.status === "idle") return null;
  const error = state.error;
  return (
    <div className="space-y-4">
      {state.steps.length > 0 ? (
        <details
          open={state.status === "running"}
          className="rounded-lg border border-border px-3 py-2"
        >
          <summary className="cursor-pointer text-sm font-medium">
            Steps ({state.steps.length})
          </summary>
          <div className="mt-2">
            <StepsList steps={state.steps} />
          </div>
        </details>
      ) : state.status === "running" ? (
        <p role="status" className="text-sm text-muted-foreground">
          {copy.agent.thinking}…
        </p>
      ) : null}
      {state.answer ? <AnswerView answer={state.answer} /> : null}
      {error?.code === "rate_limited" ? (
        <RateLimited seconds={error.retryAfter} onRetry={onRetry} />
      ) : error?.code === "not_found" ? (
        <p role="alert" className="text-sm">
          {copy.notFound.patient.title}
        </p>
      ) : error && ["agent_unavailable", "timeout", "network"].includes(error.code) ? (
        <AgentUnavailable onRetry={onRetry} />
      ) : error ? (
        <p role="alert" className="text-sm text-crit">
          {error.message || copy.errors.generic}
        </p>
      ) : null}
    </div>
  );
}
