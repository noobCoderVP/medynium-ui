import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { OverviewEvent } from "../types";

export function EventsCard({ patientId, events }: { patientId: string; events: OverviewEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent events</CardTitle>
        <Link
          href={`/patients/${patientId}?tab=timeline`}
          className="text-xs font-medium text-primary hover:underline"
        >
          Full timeline
        </Link>
      </CardHeader>
      <CardBody>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent events.</p>
        ) : (
          <ul className="divide-y divide-border">
            {events.map((e) => (
              <li key={e.event_id} className="py-2 text-sm">
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(e.date)}
                  {e.summary ? ` · ${e.summary}` : ""} ·{" "}
                  <span className="font-mono">{e.record.table}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
