"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { ChangeSet } from "@/lib/api/types";
import { formatShortDate } from "@/lib/format";
import { sourceHref } from "@/lib/source-link";
import { cn } from "@/lib/utils";
import { useChanges } from "../hooks/use-brief";

const WINDOWS = [
  { value: "previous_visit", label: "Previous visit" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
] as const;
const CATEGORY: Record<string, string> = {
  MEDICATION: "Medicines",
  LAB: "Results",
  DIAGNOSIS: "Diagnoses",
  VISIT: "Visits",
  NOTE: "Notes",
  DOCUMENT: "Reports",
};
const SHOWN = 8;

function Counts({ counts }: { counts: ChangeSet["counts"] }) {
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Changes by kind">
      {entries.map(([category, n]) => (
        <li
          key={category}
          className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium"
        >
          {n} {CATEGORY[category] ?? category}
        </li>
      ))}
    </ul>
  );
}

/** What changed, from the previous visit by default, or over the last 90 days or year. Each line opens its record. */
export function BriefChanges({ patientId, initial }: { patientId: string; initial: ChangeSet }) {
  const [from, setFrom] = useState<(typeof WINDOWS)[number]["value"]>("previous_visit");
  const other = useChanges(patientId, from, from !== "previous_visit");
  const set = from === "previous_visit" ? initial : other.data;
  return (
    <Card>
      <CardHeader>
        <CardTitle>What changed</CardTitle>
        <div
          role="group"
          aria-label="Compare with"
          className="flex rounded-md border border-border"
        >
          {WINDOWS.map((w) => (
            <button
              key={w.value}
              type="button"
              aria-pressed={from === w.value}
              onClick={() => setFrom(w.value)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium first:rounded-l-md last:rounded-r-md",
                from === w.value ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {w.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        {!set ? (
          other.isError ? (
            <p role="alert" className="text-sm text-crit">
              The comparison could not be loaded.
            </p>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
              <Spinner /> Comparing…
            </p>
          )
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {set.items.length} change{set.items.length === 1 ? "" : "s"} {set.label}
            </p>
            <Counts counts={set.counts} />
            {set.items.length > 0 ? (
              <ul className="divide-y divide-border">
                {set.items.slice(0, SHOWN).map((item, index) => (
                  <li
                    key={`${item.category}-${index}`}
                    className="flex items-baseline gap-2 py-1.5 text-sm"
                  >
                    <span className="w-16 shrink-0 text-xs text-muted-foreground">
                      {item.date ? formatShortDate(item.date) : ""}
                    </span>
                    {item.direction === "up" ? (
                      <ArrowUp className="size-3.5 shrink-0 self-center" aria-label="Increased" />
                    ) : item.direction === "down" ? (
                      <ArrowDown className="size-3.5 shrink-0 self-center" aria-label="Decreased" />
                    ) : null}
                    <Link
                      href={sourceHref(patientId, item.source)}
                      className="min-w-0 flex-1 font-medium text-primary hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {set.items.length > SHOWN ? (
              <p className="text-xs text-muted-foreground">
                The {SHOWN} most recent are shown; the Timeline has the rest.
              </p>
            ) : null}
          </>
        )}
      </CardBody>
    </Card>
  );
}
