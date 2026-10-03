import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";

/** A value that always shows when it was recorded and where it came from (06 U-6). */
export function ValueWithSource({
  value,
  date,
  source,
  children,
}: {
  value: ReactNode;
  date?: string | null;
  source?: string | null;
  children?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="font-medium tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">
        {date ? formatDate(date) : null}
        {date && source ? " · " : null}
        {source ? <span className="font-mono">{source}</span> : null}
      </div>
      {children}
    </div>
  );
}
