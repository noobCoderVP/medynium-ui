"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import {
  AgentUnavailable,
  EmptyState,
  ErrorState,
  NotFoundState,
  RateLimited,
} from "@/components/shared/state-panels";
import { StepsList } from "@/components/shared/steps-list";
import { ApiError } from "@/lib/api/errors";
import { copy } from "@/lib/copy";

const noop = () => {};

/** Every state in the matrix (05 section 7.3), with fixed inputs so a visual review is repeatable. */
export function SamplerStates() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground">Loading</h3>
        <SkeletonRows rows={3} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground">Empty</h3>
        <EmptyState title={copy.empty.timeline} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground">
          Not found (denied and missing)
        </h3>
        <NotFoundState />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground">Error with retry</h3>
        <ErrorState error={new ApiError(500, "internal_error", "x", "req-7f3a")} onRetry={noop} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground">Agent unavailable</h3>
        <AgentUnavailable onRetry={noop} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground">Rate limited</h3>
        <RateLimited seconds={30} onRetry={noop} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground">DataState: populated</h3>
        <DataState
          query={{ isPending: false, isError: false, error: null, data: ["Loaded"], refetch: noop }}
        >
          {(items) => <p className="rounded-lg border border-border p-3 text-sm">{items[0]}</p>}
        </DataState>
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground">Steps: running, done, failed</h3>
        <StepsList
          steps={[
            { step_id: "1", label: "Checking access to this patient", status: "done" },
            {
              step_id: "2",
              label: "Reading medications, labs and diagnoses",
              status: "running",
              detail: "3 medicines",
            },
            { step_id: "3", label: "Searching label text", status: "failed" },
          ]}
        />
      </div>
    </div>
  );
}
