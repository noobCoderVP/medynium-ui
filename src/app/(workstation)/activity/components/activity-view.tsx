"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import { formatNumber } from "@/lib/format";
import { AUDIT_PAGE, useAudit } from "../hooks/use-audit";
import { AuditFilters } from "./audit-filters";
import { AuditTable } from "./audit-table";

export function ActivityView() {
  const { query, filters, setFilter, setOffset, clear } = useAudit();
  const total = query.data?.total ?? 0;
  const from = total === 0 ? 0 : filters.offset + 1;
  const to = Math.min(filters.offset + AUDIT_PAGE, total);
  return (
    <>
      <PageHeading
        title="Activity log"
        note="What you and the assistant did on your behalf. Only your own entries appear."
      />
      <AuditFilters filters={filters} onChange={setFilter} onClear={clear} />
      <DataState
        query={query}
        skeleton={<SkeletonRows rows={6} />}
        isEmpty={(page) => page.items.length === 0}
        empty={<EmptyState title={copy.empty.audit} />}
      >
        {(page) => (
          <div className="space-y-3">
            <AuditTable items={page.items} />
            <nav aria-label="Pages" className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground" aria-live="polite">
                {formatNumber(from)} to {formatNumber(to)} of {formatNumber(total)}
              </span>
              <span className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.offset === 0}
                  onClick={() => setOffset(Math.max(0, filters.offset - AUDIT_PAGE))}
                >
                  <ChevronLeft aria-hidden="true" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={to >= total}
                  onClick={() => setOffset(filters.offset + AUDIT_PAGE)}
                >
                  Next
                  <ChevronRight aria-hidden="true" />
                </Button>
              </span>
            </nav>
          </div>
        )}
      </DataState>
    </>
  );
}
