"use client";

import { useUrlParams } from "@/lib/use-url-params";
import { cn } from "@/lib/utils";
import { REF, STMT, WHY } from "../lib/evidence-link";

/**
 * Opens the Why? drawer at a statement or a single evidence item. It is a real button, so it works by
 * keyboard and touch, and it is never hover-only (NFR-10). Opening pushes history so Back closes it.
 */
export function RefButton({
  answerId,
  statementId,
  evidenceId,
  children,
  className,
}: {
  answerId: string;
  statementId?: string;
  evidenceId?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { update } = useUrlParams();
  return (
    <button
      type="button"
      onClick={() =>
        update({ [WHY]: answerId, [STMT]: statementId ?? null, [REF]: evidenceId ?? null }, "push")
      }
      className={cn(
        "inline-flex min-h-6 items-center rounded border border-border bg-card px-1.5 font-mono text-xs hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}
