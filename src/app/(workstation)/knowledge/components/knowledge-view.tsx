"use client";

import { CorpusStatusCard } from "@/components/shared/corpus-status-card";
import { DataState } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useKnowledgeSearch } from "../hooks/use-knowledge";
import { DrugRail } from "./drug-rail";
import { ResultsPanel } from "./results-panel";
import { SearchBar } from "./search-bar";
import { StartPanel } from "./start-panel";

export function KnowledgeView() {
  const k = useKnowledgeSearch();
  const drugs = k.drugs.data?.items ?? [];
  return (
    <div data-fit className="flex flex-col gap-4 lg:min-h-0 lg:flex-1">
      <PageHeading
        title="Knowledge"
        note="Search the indexed drug labels by generic name, Indian brand or topic. Every result shows where it came from."
      />
      <div className="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[17rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
        <aside className="hidden min-h-0 lg:block">
          <DrugRail drugs={drugs} selected={k.drug} onSelect={k.setDrug} />
        </aside>
        <div className="min-w-0 space-y-5 lg:min-h-0 lg:overflow-y-auto lg:p-1">
          <SearchBar
            text={k.text}
            onText={k.setText}
            onSubmit={k.submit}
            drug={k.drug}
            drugNames={drugs.map((d) => d.name)}
            onDrug={k.setDrug}
            section={k.section}
            sections={k.status.data?.sections ?? []}
            onSection={k.setSection}
            canClear={k.active || k.text !== "" || k.section !== ""}
            onClear={k.clear}
            busy={k.settling}
          />
          {k.drug ? (
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{k.drug}</span> only.{" "}
              <button
                type="button"
                className="rounded text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={() => k.setDrug("")}
              >
                Search all drugs
              </button>
            </p>
          ) : null}
          {k.active ? (
            <ResultsPanel
              query={k.query}
              text={k.q}
              settling={k.settling}
              canShowMore={k.canShowMore}
              onShowMore={k.showMore}
              onDrug={k.setDrug}
            />
          ) : (
            <StartPanel onPick={k.searchFor} />
          )}
          <DataState query={k.status} skeleton={<Skeleton className="h-28" />}>
            {(status) => <CorpusStatusCard status={status} />}
          </DataState>
        </div>
      </div>
    </div>
  );
}
