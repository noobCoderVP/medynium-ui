"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/state-panels";
import { StatusChip } from "@/components/shared/chips";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { RefButton } from "@/features/evidence";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Finding } from "@/lib/api/types";
import { useFindings } from "../hooks/use-findings";
import { STATUS } from "../lib/finding-status";
import { DecisionForm } from "./decision-form";

function detail(f: Finding): string | null {
  if (f.status === "DISMISSED" && f.reason) return `Reason: ${f.reason}`;
  if (f.status === "FLAGGED" && f.follow_up_on) return `Follow up on ${formatDate(f.follow_up_on)}`;
  if (f.status === "ESCALATED") return `With ${f.assigned_to_name ?? "a colleague"}`;
  return null;
}

/**
 * What was decided about each review conclusion. A conclusion is added here from the review, then acknowledged,
 * followed up, escalated or dismissed with a reason. Nothing is decided for the clinician: the assistant cannot
 * add or change a finding.
 */
export function FindingsCard({ patientId }: { patientId: string }) {
  const { query, decide } = useFindings(patientId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Findings{query.data ? ` · ${query.data.open_count} open` : ""}</CardTitle>
      </CardHeader>
      <CardBody>
        <DataState
          query={query}
          skeleton={<SkeletonRows rows={2} />}
          isEmpty={(list) => list.items.length === 0}
          empty={
            <EmptyState icon={<ShieldCheck className="size-6" />} title="No safety findings yet">
              Run a safety review, then choose Add to findings on a conclusion to record what you
              decide.
            </EmptyState>
          }
        >
          {(list) => (
            <ul className="divide-y divide-border">
              {list.items.map((f) => (
                <li key={f.finding_id} className="space-y-2 py-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip tone={STATUS[f.status].tone}>{STATUS[f.status].label}</StatusChip>
                    <RefButton answerId={f.answer_id} statementId={f.consideration_id}>
                      Why?
                    </RefButton>
                    <span className="text-xs text-muted-foreground">
                      Raised {formatDateTime(f.created_at)}
                      {f.created_by_name ? ` by ${f.created_by_name}` : ""}
                    </span>
                  </div>
                  <p className="leading-relaxed">{f.summary}</p>
                  {detail(f) ? <p className="text-xs text-muted-foreground">{detail(f)}</p> : null}
                  <DecisionForm
                    patientId={patientId}
                    finding={f}
                    pending={decide.isPending}
                    error={decide.variables?.findingId === f.finding_id ? decide.error : null}
                    onDecide={(body) => decide.mutate({ findingId: f.finding_id, body })}
                  />
                </li>
              ))}
            </ul>
          )}
        </DataState>
      </CardBody>
    </Card>
  );
}
