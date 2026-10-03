"use client";

import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgent } from "../hooks/agent-context";

/** Opens or collapses the assistant. The workspace works the same either way. */
export function PanelToggle() {
  const { open, setOpen } = useAgent();
  return (
    <Button
      variant={open ? "secondary" : "outline"}
      size="sm"
      aria-expanded={open}
      aria-controls="agent-panel"
      onClick={() => setOpen(!open)}
    >
      <Bot aria-hidden="true" />
      <span className="max-sm:sr-only">Assistant</span>
    </Button>
  );
}
