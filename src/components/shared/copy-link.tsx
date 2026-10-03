"use client";

import { Check, Copy } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * A one-time link (invite or password reset) in a read-only field with a Copy button. If the clipboard is
 * blocked the field is still selectable by hand, so the link can never be lost.
 */
export function CopyLink({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const id = useId();

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      document.getElementById(id)?.focus();
    }
  }

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex gap-2">
        <Input id={id} readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
        <Button type="button" variant="outline" onClick={copy}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </p>
    </div>
  );
}
