import { cn } from "@/lib/utils";
import { KIND_ORDER, KINDS } from "../lib/kinds";

const chip = (active: boolean) =>
  cn(
    "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card hover:bg-muted",
  );

interface Props {
  value: string;
  total: number;
  byKind: Record<string, number>;
  onChange: (kind: string) => void;
}

/** One button per kind with its count. Empty kinds stay visible but dimmed, so the set never jumps around. */
export function KindFilter({ value, total, byKind, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
      <button
        type="button"
        aria-pressed={value === ""}
        onClick={() => onChange("")}
        className={chip(value === "")}
      >
        All ({total})
      </button>
      {KIND_ORDER.map((kind) => {
        const { label, icon: Icon } = KINDS[kind];
        const count = byKind[kind] ?? 0;
        return (
          <button
            key={kind}
            type="button"
            aria-pressed={value === kind}
            onClick={() => onChange(kind)}
            className={cn(chip(value === kind), count === 0 && value !== kind && "opacity-60")}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label} ({count})
          </button>
        );
      })}
    </div>
  );
}
