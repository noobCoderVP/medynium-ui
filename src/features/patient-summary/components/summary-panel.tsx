"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { TagChip } from "@/components/shared/chips";
import { Markdown } from "@/components/shared/markdown";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { usePatientSummary } from "../hooks/use-patient-summary";

/**
 * The written summary of the patient, stored and shown with when it was written. It is made from the record and
 * checked against it; Refresh writes it again from the record as it is now. `rail` is the tall left column of the
 * timeline (it scrolls inside itself); `card` is the full-width block on the overview.
 */
export function PatientSummaryPanel({
  patientId,
  variant = "card",
}: {
  patientId: string;
  variant?: "rail" | "card";
}) {
  const { query, refresh } = usePatientSummary(patientId);
  const summary = refresh.data ?? query.data;
  const writing = refresh.isPending;
  const failed = refresh.isError || query.isError;
  return (
    <section
      aria-label="Patient summary"
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card shadow-sm",
        variant === "rail" && "lg:sticky lg:top-2 lg:max-h-[calc(100vh-9rem)]",
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-heading">Patient summary</h2>
          {summary?.exists ? (
            <TagChip tag={summary.source === "model" ? "ai_synthesis" : "rule_check"} />
          ) : null}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refresh.mutate()}
          disabled={writing || query.isPending}
          aria-label="Refresh the patient summary"
        >
          <RefreshCw className={cn("size-3.5", writing && "animate-spin")} aria-hidden="true" />
          {writing ? "Writing…" : "Refresh"}
        </Button>
      </header>
      <div
        className={cn(
          "space-y-3 p-4",
          variant === "rail" && "max-h-80 overflow-y-auto lg:max-h-none",
        )}
      >
        {query.isPending || (writing && !summary?.exists) ? (
          <div role="status" className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {writing
                ? "Writing the summary from the record. This takes about fifteen seconds."
                : "Loading…"}
            </p>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : summary?.exists && summary.markdown ? (
          <>
            <p className="text-xs text-muted-foreground">
              Last updated {summary.generated_at ? formatDateTime(summary.generated_at) : "–"}
              {summary.generated_by ? ` · by ${summary.generated_by}` : ""}
              {summary.source === "rules"
                ? " · made by rules, the language model was unavailable"
                : ""}
            </p>
            {summary.changed_since ? (
              <p
                className="flex items-start gap-1.5 rounded-md bg-warn-soft px-2.5 py-1.5 text-xs text-warn"
                role="status"
              >
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                The record has changed since this was written. Refresh to include it.
              </p>
            ) : null}
            {writing ? (
              <p className="text-xs text-muted-foreground" role="status">
                Writing a new version…
              </p>
            ) : null}
            <Markdown text={summary.markdown} />
            <p className="border-t border-border pt-2 text-xs text-muted-foreground">
              Written from this patient&apos;s record and checked against it. Decision support only.
            </p>
          </>
        ) : null}
        {failed && !writing ? (
          <p role="alert" className="text-sm text-crit">
            The summary could not be written. The record is unaffected; try Refresh.
          </p>
        ) : null}
      </div>
    </section>
  );
}
