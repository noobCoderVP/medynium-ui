import { StatusChip, TagChip } from "@/components/shared/chips";
import { formatDate } from "@/lib/format";
import type { Citation } from "@/lib/api/types";
import { highlight } from "../lib/highlight";

function Fact({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

/**
 * One retrieved section with its full citation: drug, section, title, version, effective and retrieved dates,
 * source and page. The matching passage shows first; the whole section opens with a native disclosure.
 */
export function CitationCard({ citation: c, query }: { citation: Citation; query: string }) {
  const hasMore = c.text.length > c.snippet.replace(/^\.\.\.|\.\.\.$/g, "").length + 8;
  return (
    <li className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-3.5">
        <h2 className="text-base font-semibold">{c.drug ?? "Drug not stated"}</h2>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">{c.section}</span>
        {c.conflict ? <StatusChip tone="warn">sources differ</StatusChip> : null}
        <span className="ml-auto">
          <TagChip tag="retrieved_source" />
        </span>
      </div>
      <p className="px-4 pt-2 text-sm leading-relaxed">{highlight(c.snippet, query)}</p>
      {hasMore ? (
        <details className="group px-4 pt-2">
          <summary className="w-fit cursor-pointer rounded text-sm font-medium text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
            <span className="group-open:hidden">Read the whole section</span>
            <span className="hidden group-open:inline">Hide the whole section</span>
          </summary>
          <p className="mt-2 max-h-96 overflow-y-auto rounded-lg bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
            {highlight(c.text, query)}
          </p>
        </details>
      ) : null}
      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 rounded-b-xl border-t border-border bg-muted/30 px-4 py-2.5 text-xs">
        <Fact label="Source">{c.page ? `${c.source}, page ${c.page}` : c.source}</Fact>
        <Fact label="Version">{c.version ?? "Not stated"}</Fact>
        <Fact label="Effective">{formatDate(c.effective_date)}</Fact>
        <Fact label="Retrieved">{formatDate(c.retrieved_date)}</Fact>
        <Fact label="Document">{c.title}</Fact>
      </dl>
    </li>
  );
}
