import { copy } from "@/lib/copy";
import { formatDate } from "@/lib/format";
import type { StreamAnswer } from "@/lib/api/events";

function Row({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{items.join("; ")}</dd>
    </div>
  );
}

/** Gaps are first-class content: what was checked, what was not, and the snapshot date (05 principle 4).
 * Collapsed by default so the answer leads; one keyboard-reachable toggle opens it. */
export function LimitsBlock({ limits }: { limits: StreamAnswer["limits"] }) {
  const empty =
    limits.checked.length + limits.not_checked.length + limits.notes.length === 0 &&
    !limits.snapshot_date;
  if (empty) return null;
  return (
    <details className="rounded-lg border border-border bg-muted/50 p-3">
      <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
        {copy.gap.checked}
      </summary>
      <dl className="mt-2 space-y-1.5">
        {limits.checked.length > 0 ? <p className="text-sm">{limits.checked.join("; ")}</p> : null}
        <Row label={copy.gap.notChecked} items={limits.not_checked} />
        <Row label="Notes" items={limits.notes} />
        {limits.snapshot_date ? (
          <div>
            <dt className="text-xs font-medium text-muted-foreground">{copy.gap.snapshot}</dt>
            <dd className="text-sm">{formatDate(limits.snapshot_date)}</dd>
          </div>
        ) : null}
      </dl>
    </details>
  );
}
