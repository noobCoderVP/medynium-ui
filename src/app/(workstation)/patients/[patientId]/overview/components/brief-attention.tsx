import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttentionItem } from "@/lib/api/types";
import { formatShortDate } from "@/lib/format";
import { sourceHref } from "@/lib/source-link";
import { cn } from "@/lib/utils";

const DOT: Record<AttentionItem["severity"], string> = {
  high: "bg-crit",
  moderate: "bg-warn",
  info: "bg-muted-foreground",
};
const WORD: Record<AttentionItem["severity"], string> = {
  high: "High priority",
  moderate: "Worth a look",
  info: "For information",
};

/** What deserves a look, worst first. Each line opens the record it came from; severity is a word, not just a colour. */
export function BriefAttention({
  patientId,
  items,
  high,
}: {
  patientId: string;
  items: AttentionItem[];
  high: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Attention{items.length > 0 ? ` · ${items.length}` : ""}
          {high > 0 ? ` (${high} high)` : ""}
        </CardTitle>
      </CardHeader>
      <CardBody>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing stands out by the fixed rules. This is not a statement that nothing needs a
            look.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item, index) => (
              <li key={`${item.kind}-${index}`} className="flex gap-3 py-2 text-sm">
                <span
                  aria-hidden="true"
                  className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[item.severity])}
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={sourceHref(patientId, item.source)}
                    className="font-medium text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    <span className="sr-only">{WORD[item.severity]}. </span>
                    {[item.detail, item.date ? formatShortDate(item.date) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
