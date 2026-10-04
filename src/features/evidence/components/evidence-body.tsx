"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/shared/state-panels";
import { formatDate, formatDateTime } from "@/lib/format";
import type { EvidenceResponse } from "@/lib/api/types";
import { useEvidencePins } from "../hooks/use-evidence-pins";
import { evidenceFor } from "../lib/evidence-link";
import { PatientRecordItem, SourceItem, SqlItem } from "./evidence-items";

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">
        {title} <span className="font-normal text-muted-foreground">({count})</span>
      </h3>
      {count === 0 ? (
        <p className="text-sm text-muted-foreground">None for this answer.</p>
      ) : (
        <ul className="space-y-2">{children}</ul>
      )}
    </section>
  );
}

/** The three evidence groups. The selected statement's items are marked, and a ?ref item scrolls into view. */
export function EvidenceBody({
  data,
  statementId,
  refId,
}: {
  data: EvidenceResponse;
  statementId: string | null;
  refId: string | null;
}) {
  const linked = evidenceFor(data.statement_map, statementId);
  if (refId) linked.add(refId);
  const { isPinned, pinFor } = useEvidencePins(data.patient_id, data.answer_id);

  useEffect(() => {
    if (!refId) return;
    document.getElementById(`evidence-${refId}`)?.scrollIntoView({ block: "center" });
  }, [refId, data.answer_id]);

  if (data.patient_records.length + data.sql.length + data.sources.length === 0) {
    return <EmptyState title="This answer has no stored evidence." />;
  }

  return (
    <div className="space-y-5 p-4">
      <p className="text-xs text-muted-foreground">
        Answer <span className="font-mono">{data.answer_id}</span> · created{" "}
        {formatDateTime(data.created_at)}
        {data.route
          ? ` · route ${data.route.route}${data.route.model ? ` (${data.route.model})` : " (no model call)"}`
          : ""}
        {data.snapshot_date ? ` · source snapshot ${formatDate(data.snapshot_date)}` : ""}
      </p>
      <Section title="Patient records" count={data.patient_records.length}>
        {data.patient_records.map((item) => (
          <PatientRecordItem
            key={item.evidence_id}
            item={item}
            patientId={data.patient_id}
            highlighted={linked.has(item.evidence_id)}
            pinned={isPinned(item.evidence_id)}
            onPin={pinFor(item.evidence_id)}
          />
        ))}
      </Section>
      <Section title="Retrieved sources" count={data.sources.length}>
        {data.sources.map((item) => (
          <SourceItem
            key={item.evidence_id}
            item={item}
            highlighted={linked.has(item.evidence_id)}
            pinned={isPinned(item.evidence_id)}
            onPin={pinFor(item.evidence_id)}
          />
        ))}
      </Section>
      <Section title="SQL that ran" count={data.sql.length}>
        {data.sql.map((item) => (
          <SqlItem key={item.sql_id} item={item} highlighted={linked.has(item.sql_id)} />
        ))}
      </Section>
      {data.dropped_statements.length > 0 ? (
        <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
          {data.dropped_statements.length} statement
          {data.dropped_statements.length === 1 ? " was" : "s were"} removed because no evidence
          backed {data.dropped_statements.length === 1 ? "it" : "them"}.
        </p>
      ) : null}
    </div>
  );
}
