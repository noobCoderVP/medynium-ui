"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useAgent } from "../hooks/agent-context";

/** Opens or collapses the assistant. The workspace works the same either way. */
export function PanelToggle() {
  const { open, setOpen } = useAgent();
  return (
    <Tooltip label={open ? "Collapse assistant" : "Ask the assistant about this screen"}>
      <Button
        variant={open ? "secondary" : "outline"}
        size="sm"
        aria-expanded={open}
        aria-controls="agent-panel"
        onClick={() => setOpen(!open)}
      >
        <Sparkles aria-hidden="true" className="text-agent" />
        <span className="max-sm:sr-only">Ask AI</span>
      </Button>
    </Tooltip>
  );
}
