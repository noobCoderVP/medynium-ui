"use client";

import { FileUp } from "lucide-react";
import { useRef, useState } from "react";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { errorText, useReportActions, useReports } from "../hooks/use-reports";
import { ReportReview } from "./report-review";

const STATUS: Record<string, string> = {
  UPLOADED: "Waiting to be read",
  PARSING: "Being read",
  EXTRACTED: "Ready for review",
  REVIEWED: "Reviewed",
  REJECTED: "Rejected",
  FAILED: "Could not be read",
};

/**
 * Upload a lab report or prescription (PDF, PNG or JPEG), see what was read from it, and approve what is right.
 * What is read is only staged: each row shows the exact words and page it came from, and nothing is written to
 * the record until a doctor approves.
 */
export function ReportsTab({ patientId }: { patientId: string }) {
  const query = useReports(patientId);
  const { upload } = useReportActions(patientId);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={input}
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          className="sr-only"
          aria-label="Choose a report file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file, { onSuccess: (r) => setOpen(r.report_id) });
            e.target.value = "";
          }}
        />
        <Button size="sm" disabled={upload.isPending} onClick={() => input.current?.click()}>
          <FileUp aria-hidden="true" />
          {upload.isPending ? "Uploading…" : "Upload a report"}
        </Button>
        <p className="text-sm text-muted-foreground">
          PDF, PNG or JPEG, up to 10 MB. Synthetic data only.
        </p>
      </div>
      {upload.isError ? (
        <p role="alert" className="text-sm text-crit">
          {errorText(upload.error)}
        </p>
      ) : null}
      <DataState
        query={query}
        isEmpty={(data) => data.items.length === 0}
        empty={<EmptyState title="No reports uploaded for this patient yet." />}
      >
        {(data) => (
          <ul className="space-y-2">
            {data.items.map((report) => (
              <li key={report.report_id} className="rounded-xl border border-border bg-card">
                <button
                  type="button"
                  aria-expanded={open === report.report_id}
                  onClick={() => setOpen(open === report.report_id ? null : report.report_id)}
                  className="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl p-3 text-left text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="font-medium">{report.filename}</span>
                  <span className="text-muted-foreground">
                    {STATUS[report.status] ?? report.status}
                    {report.rows_waiting > 0 ? ` · ${report.rows_waiting} to review` : ""}
                  </span>
                </button>
                {open === report.report_id ? (
                  <ReportReview patientId={patientId} reportId={report.report_id} />
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </DataState>
    </div>
  );
}
