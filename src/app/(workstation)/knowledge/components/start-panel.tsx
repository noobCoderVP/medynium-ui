import { BookOpen } from "lucide-react";
import { EXAMPLES } from "../lib/examples";

/** Shown before anything is searched: what to type, and one-click examples. */
export function StartPanel({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
      <span
        aria-hidden="true"
        className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted/70"
      >
        <BookOpen className="size-6 text-muted-foreground" />
      </span>
      <p className="text-sm font-medium">Search the indexed drug labels</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        Type a generic name, an Indian brand or a topic. You can also pick a drug from the list to
        read its label sections.
      </p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Example searches">
        {EXAMPLES.map((example) => (
          <li key={example}>
            <button
              type="button"
              onClick={() => onPick(example)}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {example}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
