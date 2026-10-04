import Link from "next/link";
import type { ReactNode } from "react";
import { TagChip } from "@/components/shared/chips";
import { copy } from "@/lib/copy";
import type { StreamAnswer } from "@/lib/api/events";
import { EvidenceChips } from "./evidence-chips";
import { MarkdownText } from "./markdown-text";
import { RefButton } from "./ref-button";

type Consideration = StreamAnswer["considerations"][number];

/**
 * One answer statement: its tag (text and shape), the statement, the records and label sections it rests on in words
 * (each opening the real source), and a Why? button for the full evidence. The AI-synthesis tag always carries the
 * hedge, so it can never read as a clinical conclusion.
 */
export function Statement({
  answerId,
  item,
  patientId,
  action,
}: {
  answerId: string;
  item: Consideration;
  /** The patient the answer is about; a statement of a panel answer carries its own. */
  patientId?: string | null;
  /** Optional page-specific control under the statement, such as recording a decision. */
  action?: ReactNode;
}) {
  return (
    <li className="space-y-1.5 rounded-lg border border-border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <TagChip tag={item.tag} />
        {item.tag === "ai_synthesis" ? (
          <span className="text-xs text-synth">{copy.synthesisHedge}</span>
        ) : null}
      </div>
      {item.group ? (
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {item.group}
        </p>
      ) : null}
      <MarkdownText text={item.text} className="text-sm leading-relaxed" />
      {item.patient_id ? (
        <Link
          href={`/patients/${item.patient_id}`}
          className="inline-block text-xs underline underline-offset-2"
        >
          Open {item.patient_id}
        </Link>
      ) : null}
      <EvidenceChips
        answerId={answerId}
        statementId={item.id}
        patientEvidence={item.patient_evidence}
        sourceEvidence={item.source_evidence}
        patientId={item.patient_id ?? patientId ?? null}
      />
      <div className="flex flex-wrap items-center gap-1.5">
        <RefButton answerId={answerId} statementId={item.id} className="font-sans font-medium">
          Why?
        </RefButton>
      </div>
      {action}
    </li>
  );
}
