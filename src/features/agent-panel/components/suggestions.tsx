"use client";

import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";

// Starting points, not the only way in: every one of these has a manual control on its own screen (FR-20).
const WITH_PATIENT = [
  "Run the safety review",
  "What are the current medications?",
  "What changed since the last visit?",
];
const WITHOUT_PATIENT = [
  "Open the kidney patient and run the safety review",
  "What does the label say about metformin and kidney function?",
];

/** Empty-state prompts that depend on whether a patient is in scope. */
export function Suggestions({
  hasPatient,
  onPick,
}: {
  hasPatient: boolean;
  onPick: (question: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{copy.agent.empty}</p>
      <ul className="flex flex-col items-start gap-1.5" aria-label="Suggested questions">
        {(hasPatient ? WITH_PATIENT : WITHOUT_PATIENT).map((text) => (
          <li key={text}>
            <Button
              variant="outline"
              size="sm"
              className="h-auto py-1.5 text-left whitespace-normal"
              onClick={() => onPick(text)}
            >
              {text}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
