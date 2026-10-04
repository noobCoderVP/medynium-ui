"use client";

import { ExternalLink, FileText, FlaskConical } from "lucide-react";
import Link from "next/link";
import { evidenceHref } from "@/lib/source-link";
import { useEvidence } from "../hooks/use-evidence";
import { recordLabel, sourceHrefFor, sourceLabel } from "../lib/evidence-label";
import { RefButton } from "./ref-button";

interface Props {
  answerId: string;
  statementId: string;
  patientEvidence: string[];
  sourceEvidence: string[];
  /** The patient this statement is about (a panel answer has one per statement). */
  patientId: string | null;
}

/** The ids as buttons: the fallback while the evidence loads or if it cannot be read. */
function IdButtons({
  answerId,
  statementId,
  ids,
}: {
  answerId: string;
  statementId: string;
  ids: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ids.map((id) => (
        <RefButton key={id} answerId={answerId} statementId={statementId} evidenceId={id}>
          {id}
        </RefButton>
      ))}
    </div>
  );
}

/**
 * The proof under a statement, in words: the lab, medicine or label section it rests on, each with a link that opens
 * the real record (the lab on its trend, the note, the label with its full citation) and a Details button for the
 * Why? panel. Ids like P1 and S2 stay inside the panel; they are not what a clinician should have to read.
 */
export function EvidenceChips({
  answerId,
  statementId,
  patientEvidence,
  sourceEvidence,
  patientId,
}: Props) {
  const query = useEvidence(answerId);
  const ids = [...patientEvidence, ...sourceEvidence];
  if (ids.length === 0) return null;
  const data = query.data;
  if (!data) {
    return query.isPending ? (
      <p className="text-xs text-muted-foreground">Loading the sources…</p>
    ) : (
      <IdButtons answerId={answerId} statementId={statementId} ids={ids} />
    );
  }
  const records = new Map(data.patient_records.map((r) => [r.evidence_id, r]));
  const sources = new Map(data.sources.map((s) => [s.evidence_id, s]));
  const owner = patientId ?? data.patient_id;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">Based on</p>
      <ul className="space-y-1">
        {ids.map((id) => {
          const record = records.get(id);
          const source = sources.get(id);
          if (!record && !source) {
            return (
              <li key={id}>
                <RefButton answerId={answerId} statementId={statementId} evidenceId={id}>
                  {id}
                </RefButton>
              </li>
            );
          }
          const link = record
            ? evidenceHref(owner, record.table, record.record_id, record.value)
            : null;
          const href = source ? sourceHrefFor(source) : link?.href;
          const linkText = source ? "Open label" : link?.label;
          const Icon = source ? FileText : FlaskConical;
          return (
            <li key={id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
              <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>{source ? sourceLabel(source) : record ? recordLabel(record) : id}</span>
              {href ? (
                <Link
                  href={href}
                  className="inline-flex items-center gap-0.5 text-xs font-medium text-primary underline underline-offset-2"
                >
                  {linkText}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </Link>
              ) : null}
              <RefButton
                answerId={answerId}
                statementId={statementId}
                evidenceId={id}
                className="font-sans text-xs"
              >
                Details
              </RefButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
