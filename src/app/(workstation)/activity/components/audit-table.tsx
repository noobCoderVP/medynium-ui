import Link from "next/link";
import { RouteChip, StatusChip } from "@/components/shared/chips";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StepsList } from "@/components/shared/steps-list";
import { RefButton } from "@/features/evidence";
import { formatDateTime } from "@/lib/format";
import type { AuditItem } from "@/lib/api/types";
import type { StreamStep } from "@/lib/api/events";
import { humanize, outcomeTone } from "../lib/labels";

/** Stored steps are loosely typed on the wire; keep only well-formed ones for display. */
function toSteps(raw: AuditItem["steps"]): StreamStep[] {
  return raw.flatMap((s, i) =>
    typeof s.label === "string"
      ? [
          {
            step_id: String(s.step_id ?? i),
            label: s.label,
            status: s.status === "failed" ? "failed" : "done",
            detail: typeof s.detail === "string" ? s.detail : null,
          } as StreamStep,
        ]
      : [],
  );
}

const columns: Column<AuditItem>[] = [
  {
    key: "when",
    header: "When",
    sortValue: (a) => a.occurred_at,
    cell: (a) => <span className="whitespace-nowrap">{formatDateTime(a.occurred_at)}</span>,
  },
  { key: "action", header: "Action", sortValue: (a) => a.action, cell: (a) => humanize(a.action) },
  {
    key: "route",
    header: "Route",
    cell: (a) =>
      a.route ? (
        <RouteChip route={a.route} model={a.model} costNote={a.cost_note} />
      ) : (
        <span className="text-muted-foreground">–</span>
      ),
  },
  {
    key: "what",
    header: "Detail",
    className: "max-w-sm",
    cell: (a) => (
      <div className="space-y-1">
        {a.question ? <p className="line-clamp-2">{a.question}</p> : null}
        {a.patient_id ? (
          <Link
            href={`/patients/${a.patient_id}`}
            className="font-mono text-xs text-primary hover:underline"
          >
            {a.patient_id}
          </Link>
        ) : null}
        {toSteps(a.steps).length > 0 ? (
          <details>
            <summary className="cursor-pointer text-xs font-medium text-primary">
              Steps ({toSteps(a.steps).length})
            </summary>
            <div className="mt-1">
              <StepsList steps={toSteps(a.steps)} />
            </div>
          </details>
        ) : null}
      </div>
    ),
  },
  {
    key: "evidence",
    header: "Evidence",
    cell: (a) =>
      a.answer_id ? (
        <RefButton answerId={a.answer_id}>{a.answer_id}</RefButton>
      ) : (
        <span className="text-muted-foreground">–</span>
      ),
  },
  {
    key: "outcome",
    header: "Outcome",
    sortValue: (a) => a.outcome,
    cell: (a) => <StatusChip tone={outcomeTone(a.outcome)}>{humanize(a.outcome)}</StatusChip>,
  },
];

export function AuditTable({ items }: { items: AuditItem[] }) {
  return (
    <DataTable
      caption="Your activity"
      columns={columns}
      rows={items}
      rowKey={(a) => a.audit_id}
      initialSort={{ key: "when", direction: "desc" }}
    />
  );
}
