"use client";

import { useState } from "react";

/** Two lines of text with a keyboard-operable "More" toggle, so long cells keep the table stable but nothing is hidden. */
export function ClampText({ text, lines = 2 }: { text: string; lines?: number }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 48 * lines;
  return (
    <span>
      <span
        className={open || !long ? undefined : "line-clamp-2"}
        style={open || !long ? undefined : { WebkitLineClamp: lines }}
      >
        {text}
      </span>
      {long ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {open ? "Less" : "More"}
        </button>
      ) : null}
    </span>
  );
}
