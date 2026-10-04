import { CircleCheck, Info, Siren, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority } from "../lib/priority";

const STYLE: Record<Priority, { icon: LucideIcon; word: string; className: string }> = {
  high: { icon: Siren, word: "High", className: "border-crit/30 bg-crit-soft text-crit" },
  review: {
    icon: TriangleAlert,
    word: "Needs review",
    className: "border-warn/30 bg-warn-soft text-warn",
  },
  info: { icon: Info, word: "Informational", className: "border-border bg-muted text-foreground" },
  stable: {
    icon: CircleCheck,
    word: "Stable",
    className: "border-border bg-transparent text-muted-foreground",
  },
};

/** Priority as an icon and a word, so it never depends on colour alone. */
export function PriorityChip({ priority }: { priority: Priority }) {
  const { icon: Icon, word, className } = STYLE[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {word}
    </span>
  );
}
