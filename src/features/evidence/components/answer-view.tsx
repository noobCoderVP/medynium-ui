import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { RouteChip } from "@/components/shared/chips";
import { copy } from "@/lib/copy";
import type { StreamAnswer } from "@/lib/api/events";
import { CopyAnswerButton } from "./copy-answer-button";
import { LimitsBlock } from "./limits-block";
import { MarkdownText } from "./markdown-text";
import { RefButton } from "./ref-button";
import { Statement } from "./statement";

/** The answer as plain markdown for the clipboard: short answer, then each statement with its tag. */
function answerMarkdown(answer: StreamAnswer): string {
  const lines = answer.considerations.map((c) => `- ${c.text} _(${c.tag.replace("_", " ")})_`);
  return [answer.short_answer, ...(lines.length ? ["", ...lines] : [])].join("\n");
}

/**
 * A structured answer: the short answer, each tagged statement with its evidence buttons, conflicts and
 * limits. Announced once, when it appears (role="region" with a label, not a live region that re-reads).
 * A safety review with no statements is the honest gap, in the words the copy deck fixes (AI-05).
 */
export function AnswerView({
  answer,
  statementAction,
}: {
  answer: StreamAnswer;
  /** A page can add a control under a statement (the Safety tab adds "Add to findings" to conclusions). */
  statementAction?: (item: StreamAnswer["considerations"][number]) => ReactNode;
}) {
  // The fixed gap wording is for a safety review that found nothing; other kinds show their own short answer.
  const gap = answer.kind === "SAFETY" && answer.considerations.length === 0;
  return (
    <section aria-label="Answer" className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <RefButton answerId={answer.answer_id} className="font-sans font-medium">
          Why? Show evidence
        </RefButton>
        <CopyAnswerButton text={answerMarkdown(answer)} />
      </div>
      {gap ? (
        <p className="text-sm leading-relaxed font-medium">{copy.gap.title}</p>
      ) : (
        <MarkdownText text={answer.short_answer} className="text-sm leading-relaxed" />
      )}
      {gap ? <p className="text-sm text-muted-foreground">{copy.gap.note}</p> : null}
      {answer.considerations.length > 0 ? (
        <ul className="space-y-2">
          {answer.considerations.map((item) => (
            <Statement
              key={item.id}
              answerId={answer.answer_id}
              item={item}
              patientId={answer.patient_id}
              action={statementAction?.(item)}
            />
          ))}
        </ul>
      ) : null}
      {answer.conflicts.length > 0 ? (
        <div className="flex gap-2 rounded-lg border border-warn/40 bg-warn-soft p-3 text-sm text-warn">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium">Sources disagree</p>
            <ul className="mt-1 list-disc pl-4">
              {answer.conflicts.map((c) => (
                <li key={`${c.drug}-${c.section}`}>
                  {[c.drug, c.section].filter(Boolean).join(", ")}: {c.items.join(" vs ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      <LimitsBlock limits={answer.limits} />
      {answer.route ? (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium">How this was answered</summary>
          <div className="mt-1.5">
            <RouteChip
              route={answer.route.route}
              model={answer.route.model}
              costNote={answer.route.cost_note}
            />
          </div>
        </details>
      ) : null}
    </section>
  );
}
