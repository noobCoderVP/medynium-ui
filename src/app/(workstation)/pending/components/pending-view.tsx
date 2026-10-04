"use client";

import Link from "next/link";
import { DataState } from "@/components/shared/data-state";
import { PageHeading } from "@/components/shared/page-heading";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/state-panels";
import { cn } from "@/lib/utils";
import { usePending } from "../hooks/use-pending";

const KINDS: Record<string, string> = {
  ESCALATED_FINDING: "Escalated finding",
  FOLLOW_UP: "Follow-up due",
  OPEN_FINDING: "Open finding",
  REPORT_TO_REVIEW: "Report to review",
  ABNORMAL_LAB: "Abnormal lab",
  RECENT_EMERGENCY: "Recent emergency visit",
};

/** Where each kind of item is dealt with, so the link lands on the right tab. */
const TAB: Record<string, string> = {
  ESCALATED_FINDING: "safety",
  OPEN_FINDING: "safety",
  REPORT_TO_REVIEW: "reports",
  ABNORMAL_LAB: "labs",
  FOLLOW_UP: "notes",
  RECENT_EMERGENCY: "timeline",
};

export function PendingView() {
  const list = usePending();
  const byKind = list.summary.data?.by_kind ?? {};
  return (
    <div className="space-y-4">
      <PageHeading
        title="Pending work"
        note="Everything waiting on you across the patients you are assigned to. Synthetic data only."
      />
      {list.summary.data ? (
        <p className="text-sm text-muted-foreground" role="status">
          {list.summary.data.total} open, {list.summary.data.overdue} overdue, as of{" "}
          {list.summary.data.as_of}.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
        <button
          type="button"
          aria-pressed={list.kind === ""}
          onClick={() => list.setKind("")}
          className={chip(list.kind === "")}
        >
          All
        </button>
        {Object.entries(KINDS).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={list.kind === value}
            onClick={() => list.setKind(value)}
            className={chip(list.kind === value)}
          >
            {label}
            {byKind[value] ? ` (${byKind[value]})` : ""}
          </button>
        ))}
      </div>
      <DataState
        query={list.query}
        isEmpty={(page) => page.total === 0}
        empty={<EmptyState title="Nothing is waiting on you." />}
      >
        {(page) => (
          <div className="space-y-3">
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {page.items.map((item) => (
                <li key={item.item_id} className="flex flex-wrap items-start gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      <Link
                        className="underline-offset-2 hover:underline"
                        href={`/patients/${item.patient_id}?tab=${TAB[item.kind] ?? "overview"}`}
                      >
                        {item.patient_name}
                      </Link>{" "}
                      <span className="font-normal text-muted-foreground">
                        {item.patient_id} · {KINDS[item.kind] ?? item.kind}
                      </span>
                    </p>
                    <p className="text-sm">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {item.due_date ? <p>Due {item.due_date}</p> : null}
                    {item.overdue ? <p className="font-medium text-crit">Overdue</p> : null}
                  </div>
                </li>
              ))}
            </ul>
            <Pagination
              noun="items"
              total={page.total}
              offset={list.offset}
              limit={list.limit}
              onOffsetChange={list.setOffset}
              onLimitChange={() => undefined}
            />
          </div>
        )}
      </DataState>
    </div>
  );
}

const chip = (active: boolean) =>
  cn(
    "min-h-9 rounded-full border px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card hover:bg-muted",
  );
