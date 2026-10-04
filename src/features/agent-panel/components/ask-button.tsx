"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOptionalAgent } from "../hooks/agent-context";

/**
 * A contextual shortcut to the assistant: opens the panel and asks one ready-made question about what is on
 * screen. It is only a convenience (FR-20): the page it sits on has its own manual controls, and it renders
 * nothing when there is no assistant or one is already answering.
 */
export function AskButton({ question, label }: { question: string; label: string }) {
  const agent = useOptionalAgent();
  if (!agent) return null;
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={agent.running}
      onClick={() => {
        agent.setOpen(true);
        agent.ask(question);
      }}
    >
      <Sparkles aria-hidden="true" />
      {label}
    </Button>
  );
}
