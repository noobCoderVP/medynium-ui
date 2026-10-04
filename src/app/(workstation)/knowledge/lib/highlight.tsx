import type { ReactNode } from "react";

const SPECIAL = /[.*+?^${}()|[\]\\]/g;

/** Wraps the words of `query` inside `text` in <mark>, so a reader sees why a section matched. */
export function highlight(text: string, query: string): ReactNode {
  const terms = [...new Set(query.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [])];
  if (terms.length === 0) return text;
  const pattern = new RegExp(`(${terms.map((t) => t.replace(SPECIAL, "\\$&")).join("|")})`, "gi");
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-warn-soft px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
