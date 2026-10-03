import Link from "next/link";
import { X } from "lucide-react";
import { TagChip } from "@/components/shared/chips";
import { ErrorState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Briefing } from "@/lib/api/types";

/**
 * The briefing: one line per recent change, each tagged and linked to its patient. It says how it was made
 * (rules over the dashboard data, no model call) so it never reads as an opinion.
 */
export function BriefingCard({
  briefing,
  error,
  onClose,
  onRetry,
}: {
  briefing: Briefing | undefined;
  error: unknown;
  onClose: () => void;
  onRetry: () => void;
}) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!briefing) return null;
  return (
    <Card aria-label="Briefing">
      <CardHeader>
        <CardTitle>Briefing as of {formatDate(briefing.as_of)}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X aria-hidden="true" />
          Close
        </Button>
      </CardHeader>
      <CardBody className="space-y-2">
        <p className="text-xs text-muted-foreground">Made by {briefing.generated_by}.</p>
        {briefing.items.length === 0 ? (
          <p className="text-sm">{briefing.empty_note ?? "Nothing new."}</p>
        ) : (
          <ul className="divide-y divide-border text-sm" aria-live="polite">
            {briefing.items.map((item, i) => (
              <li
                key={`${item.patient_id}-${i}`}
                className="flex flex-wrap items-center gap-2 py-2"
              >
                <TagChip tag="patient_fact" />
                <Link
                  href={`/patients/${item.patient_id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {item.name}
                </Link>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
