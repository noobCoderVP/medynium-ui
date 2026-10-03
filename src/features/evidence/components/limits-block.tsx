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

/** Gaps are first-class content: what was checked, what was not, and the snapshot date (05 principle 4). */
export function LimitsBlock({ limits }: { limits: StreamAnswer["limits"] }) {
  const empty =
    limits.checked.length + limits.not_checked.length + limits.notes.length === 0 &&
    !limits.snapshot_date;
  if (empty) return null;
  return (
    <dl className="space-y-1.5 rounded-lg border border-border bg-muted/50 p-3">
      <Row label={copy.gap.checked} items={limits.checked} />
      <Row label={copy.gap.notChecked} items={limits.not_checked} />
      <Row label="Notes" items={limits.notes} />
      {limits.snapshot_date ? (
        <div>
          <dt className="text-xs font-medium text-muted-foreground">{copy.gap.snapshot}</dt>
          <dd className="text-sm">{formatDate(limits.snapshot_date)}</dd>
        </div>
      ) : null}
    </dl>
  );
}
