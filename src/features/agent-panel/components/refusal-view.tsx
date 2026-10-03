import { ShieldAlert } from "lucide-react";
import { TagChip } from "@/components/shared/chips";
import { formatDate } from "@/lib/format";
import type { StreamRefusal } from "@/lib/api/events";

/**
 * A calm, scoped refusal. For a prescribing request it also lists what the label documents for the patient's
 * current medicines, as retrieved-source statements only (AI-01, AI-10).
 */
export function RefusalView({ refusal }: { refusal: StreamRefusal }) {
  return (
    <section
      aria-label="Refusal"
      className="space-y-2 rounded-lg border border-border bg-muted/50 p-3"
    >
      <p className="flex items-start gap-2 text-sm">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span>{refusal.message}</span>
      </p>
      {refusal.considerations.length > 0 ? (
        <ul className="space-y-2">
          {refusal.considerations.map((c, index) => (
            <li
              key={index}
              className="space-y-1 rounded-md border border-border bg-card p-2 text-sm"
            >
              <TagChip tag="retrieved_source" />
              <p>{c.text}</p>
              <p className="text-xs text-muted-foreground">
                {[
                  c.drug,
                  c.section,
                  c.title,
                  c.version,
                  c.effective_date ? formatDate(c.effective_date) : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
