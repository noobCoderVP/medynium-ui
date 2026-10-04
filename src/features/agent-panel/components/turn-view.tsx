"use client";

import Link from "next/link";
import { RouteChip } from "@/components/shared/chips";
import { RateLimited, AgentUnavailable } from "@/components/shared/state-panels";
import { StepsList } from "@/components/shared/steps-list";
import { copy } from "@/lib/copy";
import { AnswerView } from "@/features/evidence";
import { hrefForAction, type Turn } from "../lib/conversation";
import { ProposalCard } from "./proposal-card";
import { RefusalView } from "./refusal-view";

const ACTION_LABEL: Record<string, string> = {
  open_patient: "Opened the patient",
  show_timeline: "Prepared the view",
  run_safety_review: "Ran the safety review",
  pin_evidence: "Pinned the evidence",
};

function TurnError({ turn, onRetry }: { turn: Turn; onRetry: () => void }) {
  const error = turn.error;
  if (!error) return null;
  if (error.code === "rate_limited")
    return <RateLimited seconds={error.retryAfter} onRetry={onRetry} />;
  if (error.code === "not_found") {
    // Denied and missing look the same, here as everywhere (SEC-05).
    return (
      <p role="alert" className="text-sm">
        {copy.notFound.patient.title}
      </p>
    );
  }
  if (error.code === "agent_unavailable" || error.code === "timeout" || error.code === "network") {
    return <AgentUnavailable onRetry={onRetry} />;
  }
  return (
    <p role="alert" className="text-sm text-crit">
      {error.message || copy.errors.generic}
    </p>
  );
}

/** One exchange: the question, route chips, live steps, any actions taken, then the answer or refusal. */
export function TurnView({ turn, onRetry }: { turn: Turn; onRetry: (question: string) => void }) {
  return (
    <article aria-label="Exchange" className="space-y-3">
      <p className="ml-auto w-fit max-w-[90%] rounded-lg bg-agent-soft px-3 py-2 text-sm text-agent">
        {turn.question}
      </p>
      {turn.steps.length > 0 ? (
        <details
          open={turn.status === "running"}
          className="rounded-lg border border-border px-3 py-2"
        >
          <summary className="cursor-pointer text-sm font-medium">
            How this was answered ({turn.steps.length} steps)
          </summary>
          <div className="mt-2 space-y-2">
            {turn.routes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {turn.routes.map((route, index) => (
                  <RouteChip
                    key={index}
                    route={route.route}
                    model={route.model}
                    costNote={route.cost_note}
                  />
                ))}
              </div>
            ) : null}
            <StepsList steps={turn.steps} />
          </div>
        </details>
      ) : null}
      {turn.actions.map((action, index) => {
        const href = hrefForAction(action);
        return (
          <p key={index} className="text-sm text-muted-foreground">
            {ACTION_LABEL[action.action] ?? action.action}
            {href ? (
              <>
                {" · "}
                <Link href={href} className="font-medium text-primary underline">
                  Open
                </Link>
              </>
            ) : null}
          </p>
        );
      })}
      {turn.answers.map((answer) => (
        <AnswerView key={answer.answer_id} answer={answer} />
      ))}
      {turn.proposals.map((proposal) => (
        <ProposalCard key={proposal.proposal_id} proposal={proposal} />
      ))}
      {turn.refusal ? <RefusalView refusal={turn.refusal} /> : null}
      <TurnError turn={turn} onRetry={() => onRetry(turn.question)} />
      {turn.status === "running" ? (
        <p className="text-sm text-muted-foreground">{copy.agent.thinking}…</p>
      ) : null}
    </article>
  );
}
