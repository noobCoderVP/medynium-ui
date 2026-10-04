import { DataState, type QueryLike } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import { formatDate } from "@/lib/format";
import type { SearchResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { CitationCard } from "./citation-card";

interface Props {
  query: QueryLike<SearchResponse>;
  text: string;
  settling: boolean;
  canShowMore: boolean;
  onShowMore: () => void;
  onDrug: (name: string) => void;
}

function Summary({ result }: { result: SearchResponse }) {
  const count = `${result.items.length}${result.has_more ? "+" : ""}`;
  const noun = result.items.length === 1 ? "section" : "sections";
  const resolved = Object.entries(result.resolved ?? {});
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        <span className="font-medium text-foreground">
          {count} {noun}
        </span>
        {result.mode === "browse" && result.scope.length > 0
          ? ` of ${result.scope.join(", ")}`
          : ""}
        {" · source snapshot "}
        {formatDate(result.snapshot_date)}
      </p>
      {resolved.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          {resolved.map(([from, to]) => (
            <span key={from} className="mr-3">
              <span className="font-medium text-foreground capitalize">{from}</span> read as {to}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

/** The results list with its summary, conflict notice, "show more" and the honest-gap state. */
export function ResultsPanel({ query, text, settling, canShowMore, onShowMore, onDrug }: Props) {
  return (
    <DataState
      query={query}
      isEmpty={(r) => r.items.length === 0}
      empty={
        <EmptyState title={query.data?.message ?? copy.empty.knowledge}>
          {query.data?.snapshot_date ? (
            <p>Source snapshot {formatDate(query.data.snapshot_date)}.</p>
          ) : null}
          {(query.data?.suggestions ?? []).length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span>Did you mean</span>
              {(query.data?.suggestions ?? []).map((name) => (
                <Button key={name} variant="outline" size="sm" onClick={() => onDrug(name)}>
                  {name}
                </Button>
              ))}
            </div>
          ) : null}
        </EmptyState>
      }
    >
      {(result) => (
        <div className={cn("space-y-3 transition-opacity", settling && "opacity-60")}>
          <Summary result={result} />
          {(result.conflicts ?? []).length > 0 ? (
            <p className="rounded-lg border border-warn/40 bg-warn-soft p-3 text-sm text-warn">
              Sources differ for: {result.conflicts.join(", ")}. Both are listed below with their
              versions.
            </p>
          ) : null}
          <ul className="space-y-3">
            {result.items.map((c) => (
              <CitationCard key={c.chunk_id} citation={c} query={text} />
            ))}
          </ul>
          {canShowMore ? (
            <div className="flex justify-center pt-1">
              <Button variant="outline" onClick={onShowMore}>
                Show more sections
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </DataState>
  );
}
