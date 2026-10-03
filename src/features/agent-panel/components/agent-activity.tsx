"use client";

import { Activity } from "lucide-react";
import { useAgent } from "../hooks/agent-context";

/** The bottom activity strip: the latest real step or action of the assistant. Quiet when idle. */
export function AgentActivity() {
  const { turns, running } = useAgent();
  const turn = turns[turns.length - 1];
  const step = turn?.steps[turn.steps.length - 1];
  const action = turn?.actions[turn.actions.length - 1];
  const text = running
    ? (step?.label ?? "Routing your request")
    : action
      ? `Last action: ${action.action.replaceAll("_", " ")}`
      : step
        ? `Last step: ${step.label}`
        : "Assistant idle";
  return (
    <div className="flex h-7 items-center gap-2 border-t border-border bg-muted/50 px-3 text-xs text-muted-foreground">
      <Activity className="size-3.5" aria-hidden="true" />
      <span className="truncate">{text}</span>
    </div>
  );
}
