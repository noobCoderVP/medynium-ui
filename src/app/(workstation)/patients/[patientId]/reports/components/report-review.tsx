"use client";

import { useState } from "react";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import type { ReportRow } from "@/lib/api/types";
import { errorText, useReport, useReportActions } from "../hooks/use-reports";

const FLAGS: Record<string, string> = {
  unmatched_test: "Test name not recognised",
  unmatched_drug: "Medicine not recognised",
  no_date: "No date on the report",
  duplicate: "Already in the record",
  already_listed: "Already on the medicine list",
};

const show = (fields: ReportRow["fields"]) =>
  Object.entries(fields)
    .filter(([, v]) => v !== null && v !== "")
    .map(([k, v]) => `${k.replaceAll("_", " ")}: ${String(v)}`)
    .join(" · ");

function Row({
  row,
  busy,
  onDecide,
}: {
  row: ReportRow;
  busy: boolean;
  onDecide: (decision: "accept" | "reject") => void;
}) {
  const done = row.status === "APPROVED" || row.status === "REJECTED";
  return (
    <li className="space-y-1 p-3 text-sm">
      <p className="font-medium">
        {row.kind}: {show(row.fields)}
      </p>
      <p className="text-muted-foreground">
        {row.collected_at
          ? `Collected ${row.collected_at}${row.time_known ? "" : " (time not on the report, noon assumed)"}`
          : "No collection date"}{" "}
        · page {row.source_page} · confidence {Math.round(row.confidence * 100)}%
      </p>
      <blockquote className="border-l-2 border-border pl-2 text-muted-foreground">
        “{row.source_quote}”
      </blockquote>
      {row.flags.length > 0 ? (
        <p className="text-warn">{row.flags.map((f) => FLAGS[f] ?? f).join("; ")}</p>
      ) : null}
      <div className="flex items-center gap-2">
        <span className="text-xs tracking-wide text-muted-foreground uppercase">{row.status}</span>
        {done ? null : (
          <>
            <Button size="xs" variant="outline" disabled={busy} onClick={() => onDecide("accept")}>
              Accept
            </Button>
            <Button size="xs" variant="outline" disabled={busy} onClick={() => onDecide("reject")}>
              Reject
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

/** One report's rows and the approve and reject buttons. Approval writes only the accepted rows. */
export function ReportReview({ patientId, reportId }: { patientId: string; reportId: string }) {
  const query = useReport(patientId, reportId);
  const { decide, approve, reject } = useReportActions(patientId);
  const [confirm, setConfirm] = useState(false);
  const error = decide.error ?? approve.error ?? reject.error;
  return (
    <div className="border-t border-border">
      <DataState query={query}>
        {(report) => (
          <div>
            {report.status === "FAILED" || report.status_detail ? (
              <p role="status" className="p-3 text-sm text-muted-foreground">
                {report.status_detail}
              </p>
            ) : null}
            {report.identity_status && report.identity_status !== "MATCH" ? (
              <label className="flex items-center gap-2 p-3 text-sm text-warn">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={confirm}
                  onChange={(e) => setConfirm(e.target.checked)}
                />
                The name on the report ({report.name_on_report ?? "not found"}) does not match this
                patient. I have checked it belongs to them.
              </label>
            ) : null}
            <ul className="divide-y divide-border">
              {report.rows.map((row) => (
                <Row
                  key={row.row_id}
                  row={row}
                  busy={decide.isPending}
                  onDecide={(decision) =>
                    decide.mutate({ reportId, rowId: row.row_id, decision, version: row.version })
                  }
                />
              ))}
            </ul>
            {error ? (
              <p role="alert" className="p-3 text-sm text-crit">
                {errorText(error)}
              </p>
            ) : null}
            {report.status === "EXTRACTED" ? (
              <div className="flex gap-2 p-3">
                <Button
                  size="sm"
                  disabled={approve.isPending}
                  onClick={() => approve.mutate({ reportId, confirmIdentity: confirm })}
                >
                  {approve.isPending ? "Saving…" : "Approve accepted rows"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={reject.isPending}
                  onClick={() => reject.mutate(reportId)}
                >
                  Reject report
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </DataState>
    </div>
  );
}
