"use client";

import { Search } from "lucide-react";
import { CorpusStatusCard } from "@/components/shared/corpus-status-card";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { copy } from "@/lib/copy";
import { formatDate } from "@/lib/format";
import { useKnowledgeSearch } from "../hooks/use-knowledge";
import { CitationCard } from "./citation-card";

export function KnowledgeView() {
  const k = useKnowledgeSearch();
  return (
    <>
      <PageHeading
        title="Knowledge"
        note="Search the indexed drug labels. Every result shows where it came from."
      />
      <form
        onSubmit={k.submit}
        role="search"
        aria-label="Search drug labels"
        className="flex flex-wrap items-end gap-3"
      >
        <div className="min-w-60 flex-1 space-y-1">
          <label htmlFor="kq" className="text-sm font-medium">
            Search
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="kq"
              className="pl-8"
              value={k.text}
              onChange={(e) => k.setText(e.target.value)}
              placeholder="Drug, Indian brand name or topic, e.g. metformin renal"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="kdrug" className="text-sm font-medium">
            Drug
          </label>
          <Select
            id="kdrug"
            className="w-44"
            value={k.drug}
            onChange={(e) => k.setDrug(e.target.value)}
          >
            <option value="">All drugs</option>
            {(k.status.data?.drugs ?? []).map((drug) => (
              <option key={drug} value={drug}>
                {drug}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <label htmlFor="ksec" className="text-sm font-medium">
            Section
          </label>
          <Input
            id="ksec"
            className="w-44"
            value={k.sectionText}
            onChange={(e) => k.setSectionText(e.target.value)}
            placeholder="e.g. Warnings"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {k.q.trim() === "" ? (
        <EmptyState title="Type a drug or topic to search the labels." />
      ) : (
        <DataState
          query={k.query}
          skeleton={<SkeletonRows rows={3} />}
          isEmpty={(r) => r.items.length === 0}
          empty={
            <EmptyState title={k.query.data?.message ?? copy.empty.knowledge}>
              {k.query.data?.snapshot_date
                ? `Source snapshot ${formatDate(k.query.data.snapshot_date)}.`
                : null}
            </EmptyState>
          }
        >
          {(result) => (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {result.items.length} section{result.items.length === 1 ? "" : "s"} · source
                snapshot {formatDate(result.snapshot_date)}
                {Object.entries(result.resolved ?? {}).map(
                  ([from, to]) => ` · ${from} resolved to ${to}`,
                )}
              </p>
              {(result.conflicts ?? []).length > 0 ? (
                <p className="rounded-lg border border-warn/40 bg-warn-soft p-3 text-sm text-warn">
                  Sources differ for: {(result.conflicts ?? []).join(", ")}. Both are listed below
                  with their versions.
                </p>
              ) : null}
              <ul className="space-y-3">
                {result.items.map((c) => (
                  <CitationCard key={c.chunk_id} citation={c} />
                ))}
              </ul>
            </div>
          )}
        </DataState>
      )}

      <DataState query={k.status} skeleton={<Skeleton className="h-28" />}>
        {(status) => <CorpusStatusCard status={status} />}
      </DataState>
    </>
  );
}
