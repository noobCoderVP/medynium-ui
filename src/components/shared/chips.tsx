import {
  BookOpen,
  FileText,
  FlaskConical,
  Pill,
  Siren,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { copy } from "@/lib/copy";
import type { Flag, Tag } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap";

const tagStyle: Record<Tag, { icon: LucideIcon; className: string }> = {
  patient_fact: { icon: UserRound, className: "border-fact/30 bg-fact-soft text-fact" },
  retrieved_source: { icon: BookOpen, className: "border-source/30 bg-source-soft text-source" },
  ai_synthesis: { icon: Sparkles, className: "border-synth/30 bg-synth-soft text-synth" },
};

/** One of the three evidence tags. Text and icon shape carry the meaning, not colour alone (NFR-10). */
export function TagChip({ tag, className }: { tag: Tag; className?: string }) {
  const { icon: Icon, className: tone } = tagStyle[tag];
  return (
    <span className={cn(base, tone, className)}>
      <Icon className="size-3" aria-hidden="true" />
      {copy.tags[tag].label}
    </span>
  );
}

const flagIcon: Record<Flag["type"], LucideIcon> = {
  NEW_LAB: FlaskConical,
  NEW_MEDICATION: Pill,
  RECENT_EMERGENCY: Siren,
  NEW_DOCUMENT: FileText,
};

/** A "what changed" flag on a worklist row. */
export function FlagChip({ flag }: { flag: Flag }) {
  const Icon = flagIcon[flag.type];
  const urgent = flag.type === "RECENT_EMERGENCY";
  return (
    <span
      className={cn(
        base,
        urgent ? "border-crit/30 bg-crit-soft text-crit" : "border-border bg-muted text-foreground",
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {flag.label}
    </span>
  );
}

/** The route the assistant took, with the model, or "no model call" for free routes. */
export function RouteChip({
  route,
  model,
  costNote,
}: {
  route: string;
  model?: string | null;
  costNote?: string | null;
}) {
  const free = !model || (costNote ?? "").includes("no model");
  return (
    <span className={cn(base, "border-agent/30 bg-agent-soft text-agent")}>
      <span className="font-mono">{route}</span>
      <span aria-hidden="true">·</span>
      <span>{free ? (costNote ?? copy.agent.noModel) : model}</span>
    </span>
  );
}

/** Neutral status chip, for outcomes shown by text as well as tone. */
export function StatusChip({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "crit" | "muted";
  children: string;
}) {
  const style = {
    ok: "border-ok/30 bg-ok-soft text-ok",
    warn: "border-warn/30 bg-warn-soft text-warn",
    crit: "border-crit/30 bg-crit-soft text-crit",
    muted: "border-border bg-muted text-muted-foreground",
  }[tone];
  return <span className={cn(base, style)}>{children}</span>;
}
