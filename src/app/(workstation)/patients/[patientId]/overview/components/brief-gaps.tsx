import { CircleHelp } from "lucide-react";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { AskButton } from "@/features/agent-panel";
import type { GapItem } from "@/lib/api/types";
import { sourceHref } from "@/lib/source-link";

/**
 * What the record does not show: usual follow-up results not seen lately, medicines with no indexed label, no allergy
 * information. Prompts to look, in the same words as a safety review's gaps; never "all clear".
 */
export function BriefGaps({ patientId, items }: { patientId: string; items: GapItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing information{items.length > 0 ? ` · ${items.length}` : ""}</CardTitle>
        {items.length > 0 ? (
          <AskButton label="Explain" question="What is missing from this patient's record?" />
        ) : null}
      </CardHeader>
      <CardBody>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            The fixed rules found no gaps. This is not a statement that nothing is missing.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((gap, index) => (
              <li key={`${gap.kind}-${index}`} className="flex gap-2 text-sm">
                <CircleHelp
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  {gap.source ? (
                    <Link
                      href={sourceHref(patientId, gap.source)}
                      className="font-medium text-primary hover:underline"
                    >
                      {gap.title}
                    </Link>
                  ) : (
                    <span className="font-medium">{gap.title}</span>
                  )}
                  {gap.detail ? (
                    <p className="text-xs text-muted-foreground">{gap.detail}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
