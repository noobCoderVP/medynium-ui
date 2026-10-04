"use client";

import { DataState } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { Pagination } from "@/components/shared/pagination";
import { StatGrid } from "@/components/shared/stat-grid";
import { StatTile } from "@/components/shared/stat-tile";
import { EmptyState } from "@/components/shared/state-panels";
import { useIsDoctor } from "@/features/session";
import { formatDate } from "@/lib/format";
import { usePending } from "../hooks/use-pending";
import { useReviewLab } from "../hooks/use-review-lab";
import { KindFilter } from "./kind-filter";
import { PendingRow } from "./pending-row";

export function PendingView() {
  const list = usePending();
  const lab = useReviewLab();
  const isDoctor = useIsDoctor();
  const summary = list.summary.data;
  return (
    <div className="space-y-4">
      <PageHeading
        title="Pending work"
        note="What is waiting on you across your patients, most urgent first. Synthetic data only."
      />
      {summary ? (
        <StatGrid className="md:grid-cols-3 xl:grid-cols-3">
          <StatTile label="Open items" value={summary.total} note="across your patients" />
          <StatTile
            label="Overdue"
            value={summary.overdue}
            note={summary.overdue ? "follow-ups past their date" : "nothing late"}
          />
          <StatTile
            label="As of"
            value={formatDate(summary.as_of)}
            note="date the list is judged by"
          />
        </StatGrid>
      ) : null}
      <KindFilter
        value={list.kind}
        total={summary?.total ?? 0}
        byKind={summary?.by_kind ?? {}}
        onChange={list.setKind}
      />
      {lab.message ? (
        <p role="alert" className="text-sm text-crit">
          {lab.message}
        </p>
      ) : null}
      <DataState
        query={list.query}
        isEmpty={(page) => page.total === 0}
        empty={
          <EmptyState
            title={list.kind ? "Nothing of this kind is waiting." : "Nothing is waiting on you."}
          />
        }
      >
        {(page) => (
          <div className="space-y-3">
            <ul
              aria-label="Pending items"
              className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              {page.items.map((item) => (
                <PendingRow
                  key={item.item_id}
                  item={item}
                  saving={lab.savingId === item.source_id}
                  canReview={isDoctor}
                  onReview={(it) =>
                    it.source_id && lab.review({ patientId: it.patient_id, labId: it.source_id })
                  }
                />
              ))}
            </ul>
            <Pagination
              noun="items"
              total={page.total}
              offset={list.offset}
              limit={list.limit}
              onOffsetChange={list.setOffset}
            />
          </div>
        )}
      </DataState>
    </div>
  );
}
