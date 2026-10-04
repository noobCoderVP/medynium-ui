import Link from "next/link";
import { DoctorLine } from "@/components/shared/doctor-line";
import { RowList, Row } from "@/components/shared/row-list";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate } from "@/lib/format";
import { recordHref } from "@/lib/event-types";
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
          <RowList>
            {events.map((e) => (
              <Row key={e.event_id}>
                <div className="flex gap-3">
                  <p className="w-14 shrink-0 text-xs font-semibold text-muted-foreground uppercase">
                    {formatShortDate(e.date)}
                  </p>
                  <div className="min-w-0">
                    <Link
                      href={recordHref(patientId, e)}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {e.title}
                    </Link>
                    {e.summary ? (
                      <p className="text-xs text-muted-foreground">{e.summary}</p>
                    ) : null}
                    <DoctorLine doctor={e.doctor} />
                  </div>
                </div>
              </Row>
            ))}
          </RowList>
        )}
      </CardBody>
    </Card>
  );
}
