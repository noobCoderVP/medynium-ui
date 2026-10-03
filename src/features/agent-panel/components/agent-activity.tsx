"use client";

import { Activity } from "lucide-react";
import { useAgent } from "../hooks/agent-context";

/** A floating pill with the assistant's current step. It takes no layout space and is absent when idle. */
export function AgentActivity() {
  const { turns, running } = useAgent();
  const turn = turns[turns.length - 1];
  const step = turn?.steps[turn.steps.length - 1];
  const action = turn?.actions[turn.actions.length - 1];
  if (!running) return null;
  const text =
    step?.label ??
    (action ? `Last action: ${action.action.replaceAll("_", " ")}` : "Routing your request");
  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-16 left-1/2 z-30 flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-lg md:bottom-4"
    >
      <Activity className="size-3.5 animate-pulse text-agent" aria-hidden="true" />
      <span className="truncate">{text}</span>
    </div>
  );
}
