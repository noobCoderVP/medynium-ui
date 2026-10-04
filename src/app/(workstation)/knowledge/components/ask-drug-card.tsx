"use client";

import { Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useOptionalAgent } from "@/features/agent-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DRUG_QUESTIONS } from "../lib/examples";

/**
 * Ask the assistant about a medicine or about medicines for a condition. On this screen every question goes to the
 * drug route: it reads the indexed labels and answers with cited statements, never an instruction. It is a
 * convenience (FR-20): the search below does the same retrieval by hand, and the card is absent when there is no
 * assistant.
 */
export function AskDrugCard() {
  const agent = useOptionalAgent();
  const [text, setText] = useState("");
  if (!agent) return null;

  const send = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || agent.running) return;
    agent.setOpen(true);
    agent.ask(trimmed);
    setText("");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    send(text);
  };

  return (
    <section
      aria-label="Ask about a drug"
      className="space-y-2 rounded-xl border border-border bg-card p-3"
    >
      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ask about a drug or a condition, e.g. details of amoxicillin"
          aria-label="Ask the assistant about a drug or condition"
        />
        <Button type="submit" disabled={agent.running || text.trim() === ""}>
          <Sparkles aria-hidden="true" />
          Ask AI
        </Button>
      </form>
      <ul className="flex flex-wrap gap-2" aria-label="Example drug questions">
        {DRUG_QUESTIONS.map((question) => (
          <li key={question}>
            <button
              type="button"
              disabled={agent.running}
              onClick={() => send(question)}
              className="rounded-full border border-border bg-background px-3 py-1 text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Answers come from the indexed US drug labels, with the source of every statement. They
        describe what the labels document; the choice of medicine and dose stays with you.
      </p>
    </section>
  );
}
