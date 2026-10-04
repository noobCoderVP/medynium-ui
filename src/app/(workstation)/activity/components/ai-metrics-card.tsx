"use client";

import type { AiMetrics } from "@/lib/api/types";
import { useAiMetrics } from "../hooks/use-ai-metrics";

function Pairs({ label, values }: { label: string; values: Record<string, number> }) {
  const entries = Object.entries(values).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{entries.map(([k, n]) => `${k} ${n}`).join(" · ")}</dd>
    </div>
  );
}

const seconds = (value: number | null | undefined) =>
  value === null || value === undefined ? "n/a" : `${value.toFixed(1)} s`;

/** Basic observability for the assistant: volume, routes, models, tools chosen and how long people waited. */
export function AiMetricsCard() {
  const query = useAiMetrics(7);
  if (query.isPending || query.isError) return null; // a convenience card: the log below never waits for it
  const m: AiMetrics = query.data;
  if (m.entries === 0) return null;
  return (
    <details className="group rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
        <span className="font-semibold tracking-tight text-heading">
          How the assistant has performed · last {m.days} days
        </span>
        <span className="text-muted-foreground">
          {m.asks} questions · typical wait {seconds(m.median_seconds)} · {m.proposals_approved}{" "}
          changes approved
        </span>
      </summary>
      <div className="border-t border-border p-5">
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Questions asked</dt>
            <dd className="text-lg font-semibold tabular-nums">{m.asks}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Typical wait</dt>
            <dd className="text-lg font-semibold tabular-nums">{seconds(m.median_seconds)}</dd>
            <dd className="text-xs text-muted-foreground">
              slowest 1 in 20: {seconds(m.p95_seconds)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Changes approved</dt>
            <dd className="text-lg font-semibold tabular-nums">{m.proposals_approved}</dd>
            <dd className="text-xs text-muted-foreground">{m.proposals_discarded} discarded</dd>
          </div>
          <Pairs label="Routes" values={m.by_route} />
          <Pairs label="Planner" values={m.planner_models} />
          <Pairs label="Models that wrote answers" values={m.models} />
          <Pairs label="Tools chosen" values={m.tools} />
          {m.slowest_steps.length > 0 ? (
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Slowest steps</dt>
              <dd className="text-sm">
                {m.slowest_steps
                  .map((s) => `${s.label} ${s.average_seconds.toFixed(1)} s`)
                  .join(" · ")}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </details>
  );
}
