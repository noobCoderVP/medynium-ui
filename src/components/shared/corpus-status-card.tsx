import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/format";
import type { KnowledgeStatus } from "@/lib/api/types";

/** What the index contains and when it was taken, so a "not found" is read against its real coverage. */
export function CorpusStatusCard({ status }: { status: KnowledgeStatus }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What is indexed</CardTitle>
      </CardHeader>
      <CardBody>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Snapshot date</dt>
            <dd className="font-medium">{formatDate(status.snapshot_date)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Drugs</dt>
            <dd className="font-medium tabular-nums">{formatNumber(status.drug_count)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Documents</dt>
            <dd className="font-medium tabular-nums">{formatNumber(status.document_count)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Sections</dt>
            <dd className="font-medium tabular-nums">{formatNumber(status.chunk_count)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">
          Sources: {status.sources.join(", ") || "none"}.{status.notes ? ` ${status.notes}` : ""}
        </p>
      </CardBody>
    </Card>
  );
}
