"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { abnormalLabs, refRange } from "@/lib/abnormal-labs";
import type { Overview } from "@/lib/api/types";
import { formatDate, formatValue } from "@/lib/format";

/**
 * Insight to evidence to source record: the recorded values behind the clinical summary, with their dates and
 * source tables, and a link to each trend. Opens on click, no hover.
 */
export function EvidenceDrawer({ patient }: { patient: Overview }) {
  const [open, setOpen] = useState(false);
  const flagged = abnormalLabs(patient.latest_labs);
  const base = `/patients/${encodeURIComponent(patient.patient_id)}`;
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        View supporting evidence
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        placement="right"
        title="Supporting evidence"
        description="Recorded values behind the clinical summary. Nothing here is model-generated."
      >
        <div className="space-y-5 p-4 text-sm">
          <section aria-label="Counts" className="space-y-1">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Counts
            </h3>
            <ul className="list-inside list-disc">
              <li>{patient.diagnoses.length} recorded diagnoses</li>
              <li>{patient.medications.length} current medications</li>
              <li>{flagged.length} results outside the reference range</li>
            </ul>
          </section>
          <section aria-label="Flagged results" className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Flagged results
            </h3>
            {flagged.length === 0 ? (
              <p className="text-muted-foreground">No results outside the reference range.</p>
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {flagged.map((lab) => {
                  const range = refRange(lab);
                  return (
                    <li key={lab.lab_id} className="space-y-0.5 p-3">
                      <p className="font-semibold">
                        {lab.test}: {formatValue(lab.value, lab.unit)}{" "}
                        <span className="text-crit">
                          {lab.flag === "HIGH" ? "↑ High" : "↓ Low"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(lab.date)}
                        {range ? ` · Reference ${range}` : ""}
                        {lab.previous
                          ? ` · Previous ${formatValue(lab.previous.value, lab.unit)} on ${formatDate(lab.previous.date)}`
                          : ""}
                      </p>
                      <p className="text-xs">
                        Source:{" "}
                        <span className="font-mono">{lab.source ?? "CLINICAL.LAB_RESULT"}</span> ·{" "}
                        <Link
                          href={`${base}?tab=labs&lab=${encodeURIComponent(lab.code)}`}
                          className="font-medium text-primary hover:underline"
                        >
                          Open trend
                        </Link>
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          <p className="text-xs text-muted-foreground">
            Decision support from synthetic data, not a diagnosis.
          </p>
        </div>
      </Dialog>
    </>
  );
}
