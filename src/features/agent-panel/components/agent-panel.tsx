"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PoweredBySnowflake } from "@/components/shared/powered-by-snowflake";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { copy } from "@/lib/copy";
import { easeOut } from "@/lib/motion";
import { useAgent } from "../hooks/agent-context";
import { useAgentScope } from "../hooks/use-agent-scope";
import { usePanelWidth } from "../hooks/use-panel-width";
import { AskForm } from "./ask-form";
import { ResizeHandle } from "./resize-handle";
import { Suggestions } from "./suggestions";
import { TurnView } from "./turn-view";

function announcement(turn: ReturnType<typeof useAgent>["turns"][number] | undefined): string {
  if (!turn || turn.status === "running") return "";
  if (turn.answers.length > 0)
    return `Answer ready. ${turn.answers[turn.answers.length - 1].short_answer}`;
  if (turn.refusal) return turn.refusal.message;
  return turn.status === "failed" ? copy.agent.unavailableShort : "";
}

/**
 * The collapsible assistant. Right column on wide screens, an overlay on tablets and a bottom sheet on phones.
 * Collapsed or failing, it never blocks the workspace. The answer is announced once, when it completes.
 */
export function AgentPanel() {
  const { open, setOpen, turns, ask, clear } = useAgent();
  const scope = useAgentScope();
  const end = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { width, setWidth } = usePanelWidth();

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [turns]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={easeOut}
          id="agent-panel"
          aria-label="Assistant"
          style={{ "--agent-w": `${width}px` } as CSSProperties}
          className={
            expanded
              ? "fixed inset-0 z-40 flex flex-col bg-card"
              : "fixed z-30 flex flex-col border border-border bg-card shadow-lg max-md:inset-x-0 max-md:bottom-0 max-md:h-[75dvh] max-md:rounded-t-xl md:inset-y-0 md:right-0 md:w-[var(--agent-w)] xl:relative xl:h-auto xl:w-[var(--agent-w)] xl:shrink-0 xl:rounded-none xl:border-y-0 xl:border-r-0 xl:shadow-none"
          }
        >
          {expanded ? null : <ResizeHandle width={width} onResize={setWidth} />}
          <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Sparkles className="size-4 shrink-0 text-agent" aria-hidden="true" />
              <h2 className="text-sm font-semibold">Assistant</h2>
              <span className="truncate rounded-md border border-agent/30 bg-agent-soft px-1.5 py-0.5 text-xs text-agent">
                {scope.patientId ? copy.agent.scope(scope.name ?? "loading…") : copy.agent.noScope}
              </span>
            </div>
            <div className="flex items-center">
              <Tooltip label="Clear conversation" disabled={turns.length === 0}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Clear conversation"
                  onClick={clear}
                  disabled={turns.length === 0}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </Tooltip>
              <Tooltip label={expanded ? "Exit full window" : "Open full window"}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={expanded ? "Exit full window" : "Open full window"}
                  aria-pressed={expanded}
                  onClick={() => setExpanded((value) => !value)}
                >
                  {expanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
                </Button>
              </Tooltip>
              <Tooltip label="Collapse assistant">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Collapse assistant"
                  onClick={() => setOpen(false)}
                >
                  <X aria-hidden="true" />
                </Button>
              </Tooltip>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className={`space-y-5 p-3 ${expanded ? "mx-auto max-w-3xl md:p-6" : ""}`}>
              {turns.length === 0 ? (
                <Suggestions hasPatient={Boolean(scope.patientId)} onPick={ask} />
              ) : null}
              {turns.map((turn, index) => (
                <TurnView
                  key={turn.id}
                  turn={turn}
                  onRetry={ask}
                  onFollowUp={index === turns.length - 1 ? ask : undefined}
                />
              ))}
              <p className="sr-only" aria-live="polite">
                {announcement(turns[turns.length - 1])}
              </p>
              <div ref={end} />
            </div>
          </div>
          <div className="border-t border-border p-3">
            <div className={expanded ? "mx-auto max-w-3xl" : ""}>
              <AskForm />
              <PoweredBySnowflake className="mt-2" />
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
