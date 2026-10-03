import { TagChip } from "@/components/shared/chips";
import { copy } from "@/lib/copy";
import type { StreamAnswer } from "@/lib/api/events";
import { RefButton } from "./ref-button";

type Consideration = StreamAnswer["considerations"][number];

/**
 * One answer statement: its tag (text and shape), the statement, and a button per piece of evidence.
 * The AI-synthesis tag always carries the hedge, so it can never read as a clinical conclusion.
 */
export function Statement({ answerId, item }: { answerId: string; item: Consideration }) {
  const ids = [...item.patient_evidence, ...item.source_evidence];
  return (
    <li className="space-y-1.5 rounded-lg border border-border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <TagChip tag={item.tag} />
        {item.tag === "ai_synthesis" ? (
          <span className="text-xs text-synth">{copy.synthesisHedge}</span>
        ) : null}
      </div>
      <p className="text-sm leading-relaxed">{item.text}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <RefButton answerId={answerId} statementId={item.id} className="font-sans font-medium">
          Why?
        </RefButton>
        {ids.map((id) => (
          <RefButton key={id} answerId={answerId} statementId={item.id} evidenceId={id}>
            {id}
          </RefButton>
        ))}
      </div>
    </li>
  );
}
