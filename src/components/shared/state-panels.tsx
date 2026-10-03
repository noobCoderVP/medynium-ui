"use client";

import { AlertTriangle, Bot, Inbox, SearchX, Timer } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

function Panel({
  icon,
  title,
  children,
  tone = "muted",
  role,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  tone?: "muted" | "crit" | "agent";
  role?: "alert" | "status";
}) {
  return (
    <div
      role={role}
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center",
        tone === "crit" && "border-crit/40 bg-crit-soft text-crit",
        tone === "agent" && "border-agent/40 bg-agent-soft text-agent",
        tone === "muted" && "border-border text-muted-foreground",
      )}
    >
      <span aria-hidden="true">{icon}</span>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {children ? <div className="text-sm">{children}</div> : null}
    </div>
  );
}

/** Says why it is empty and what to do next (state matrix, 05 section 7.3). */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <Panel icon={<Inbox className="size-6" />} title={title}>
      {children}
    </Panel>
  );
}

/** One state for a denied patient and a missing one (SEC-05). It never says which. */
export function NotFoundState({
  title = copy.notFound.patient.title,
  body = copy.notFound.patient.body,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Panel icon={<SearchX className="size-6" />} title={title}>
      {body}
    </Panel>
  );
}

/** Plain message, request id and a retry. Never a stack trace. */
export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const api = error instanceof ApiError ? error : null;
  const message =
    api?.status === 501
      ? copy.errors.notImplemented
      : api?.status === 403
        ? copy.errors.forbidden
        : api && api.status < 500
          ? api.message
          : api
            ? copy.errors.generic
            : copy.errors.network;
  return (
    <Panel icon={<AlertTriangle className="size-6" />} title={message} tone="crit" role="alert">
      {api?.requestId ? (
        <p className="font-mono text-xs">{copy.errors.requestId(api.requestId)}</p>
      ) : null}
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Panel>
  );
}

/** Shown in the agent panel and beside agent-backed controls only. The workspace keeps working. */
export function AgentUnavailable({ onRetry }: { onRetry?: () => void }) {
  return (
    <Panel
      icon={<Bot className="size-6" />}
      title={copy.agent.unavailable}
      tone="agent"
      role="status"
    >
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Panel>
  );
}

/** "Try again in N seconds" with a live countdown; the retry unlocks at zero. */
export function RateLimited({
  seconds,
  onRetry,
}: {
  seconds: number | null;
  onRetry?: () => void;
}) {
  const [left, setLeft] = useState(seconds ?? 10);
  useEffect(() => {
    if (left <= 0) return;
    const timer = setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);
  return (
    <Panel
      icon={<Timer className="size-6" />}
      title={copy.errors.rateLimited(left > 0 ? left : null)}
      role="status"
    >
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-2" disabled={left > 0} onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Panel>
  );
}
