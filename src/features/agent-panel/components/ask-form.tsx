"use client";

import { SendHorizontal, Square } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import { useAgent } from "../hooks/agent-context";

/** The one place a question is typed. Used by the panel and by the top-bar command bar. */
export function AskForm({ className }: { className?: string }) {
  const { ask, stop, running, setOpen } = useAgent();
  const [text, setText] = useState("");
  const id = useId();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setOpen(true);
    ask(text);
    setText("");
  }

  return (
    <form onSubmit={submit} className={className} role="search" aria-label="Ask the assistant">
      <label htmlFor={id} className="sr-only">
        {copy.agent.placeholder}
      </label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          value={text}
          maxLength={2000}
          placeholder={copy.agent.placeholder}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
        {running ? (
          <Button type="button" variant="outline" size="icon" aria-label="Stop" onClick={stop}>
            <Square aria-hidden="true" />
          </Button>
        ) : (
          <Button type="submit" size="icon" aria-label="Send" disabled={!text.trim()}>
            <SendHorizontal aria-hidden="true" />
          </Button>
        )}
      </div>
    </form>
  );
}
