"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Copies the answer as markdown text. Falls back silently when the clipboard is blocked. */
export function CopyAnswerButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }
  return (
    <Button variant="ghost" size="sm" onClick={copyText} aria-label="Copy answer">
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
