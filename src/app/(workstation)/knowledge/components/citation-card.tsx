import { TagChip, StatusChip } from "@/components/shared/chips";
import { formatDate } from "@/lib/format";
import type { Citation } from "@/lib/api/types";

/**
 * One retrieved section with its full citation block: title, drug, section, version, effective and retrieved
 * dates, source and page. The snippet shows first; the whole section opens with a native disclosure.
 */
export function CitationCard({ citation: c }: { citation: Citation }) {
  return (
    <li className="space-y-2 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <TagChip tag="retrieved_source" />
        {c.conflict ? <StatusChip tone="warn">sources differ</StatusChip> : null}
      </div>
      <h2 className="text-sm font-semibold">{c.title}</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
        <dt className="text-muted-foreground">Drug</dt>
        <dd>{c.drug ?? "Not stated"}</dd>
        <dt className="text-muted-foreground">Section</dt>
        <dd>{c.section}</dd>
        <dt className="text-muted-foreground">Version</dt>
        <dd>{c.version ?? "Not stated"}</dd>
        <dt className="text-muted-foreground">Effective</dt>
        <dd>{formatDate(c.effective_date)}</dd>
        <dt className="text-muted-foreground">Retrieved</dt>
        <dd>{formatDate(c.retrieved_date)}</dd>
        <dt className="text-muted-foreground">Source</dt>
        <dd>
          {c.source}
          {c.page ? `, page ${c.page}` : ""}
        </dd>
      </dl>
      <blockquote className="border-l-2 border-source pl-3 text-sm leading-relaxed">
        {c.snippet}
      </blockquote>
      {c.text.length > c.snippet.length ? (
        <details>
          <summary className="cursor-pointer text-sm font-medium text-primary">
            Read the whole section
          </summary>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{c.text}</p>
        </details>
      ) : null}
    </li>
  );
}
