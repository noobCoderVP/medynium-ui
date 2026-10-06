"use client";

import { Button } from "@/components/ui/button";
import type { StreamAnswer } from "@/lib/api/events";

/** One-tap next questions after an answer. The assistant remembers the answer, so "the first one" and "list them" work. */
function followUps(answer: StreamAnswer): string[] {
  if (answer.kind === "PANEL") {
    const summaryOnly = answer.considerations.length === 0;
    return [
      ...(summaryOnly ? ["List them"] : []),
      "Open the first one",
      "What changed since Monday?",
      "What is pending?",
    ];
  }
  if (answer.patient_id && answer.kind !== "SAFETY") {
    return [
      "What changed since the last visit?",
      "Run the safety review",
      "What are the current medications?",
    ];
  }
  return [];
}

export function FollowUps({
  answer,
  onPick,
}: {
  answer: StreamAnswer;
  onPick: (question: string) => void;
}) {
  const options = followUps(answer);
  if (options.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Follow-up questions">
      {options.map((text) => (
        <li key={text}>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onPick(text)}>
            {text}
          </Button>
        </li>
      ))}
    </ul>
  );
}
