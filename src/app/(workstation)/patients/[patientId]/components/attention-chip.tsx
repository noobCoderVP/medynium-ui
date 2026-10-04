"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Menu, MenuItem } from "@/components/ui/menu";
import { abnormalLabs } from "@/lib/abnormal-labs";
import type { Overview } from "@/lib/api/types";
import { formatShortDate, formatValue } from "@/lib/format";
import { sourceHref } from "@/lib/source-link";
import { useBrief } from "../overview/hooks/use-brief";

const MAX_ROWS = 4;

const trigger = (count: number) => (
  <button
    type="button"
    className="inline-flex h-6 items-center gap-1.5 rounded-full bg-crit-soft px-2.5 text-xs font-semibold text-crit transition-colors hover:bg-crit/15"
  >
    <span aria-hidden="true" className="size-2 rounded-full bg-crit" />
    {count} {count === 1 ? "attention item" : "attention items"}
  </button>
);

/**
 * The attention count as one clickable chip. It uses the same items as the Clinical brief (so the two never disagree)
 * and, if the brief cannot be loaded, the flagged results from the overview (nothing shows while it loads, so the count
 * never changes under the reader). Either way it is fixed rules
 * over recorded values, no model, with a way into the safety review.
 */
export function AttentionChip({ patient }: { patient: Overview }) {
  const brief = useBrief(patient.patient_id);
  const base = `/patients/${encodeURIComponent(patient.patient_id)}`;
  const items = brief.data?.attention.items;
  if (brief.isPending) return null; // a count that changes a moment later (2 then 3) reads as a mistake
  if (items) {
    if (items.length === 0) {
      return (
        <span className="inline-flex h-6 items-center rounded-full bg-ok-soft px-2.5 text-xs font-semibold text-ok">
          Nothing flagged
        </span>
      );
    }
    return (
      <Menu align="start" trigger={trigger(items.length)} className="min-w-64">
        {items.slice(0, MAX_ROWS).map((item, index) => (
          <MenuItem
            key={`${item.kind}-${index}`}
            render={<Link href={sourceHref(patient.patient_id, item.source)} />}
            className="gap-4"
          >
            <span className="font-medium">{item.title}</span>
          </MenuItem>
        ))}
        <MenuItem render={<Link href={base} />} className="font-medium text-primary">
          See the clinical brief
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </MenuItem>
      </Menu>
    );
  }
  const all = abnormalLabs(patient.latest_labs);
  if (all.length === 0) {
    return (
      <span className="inline-flex h-6 items-center rounded-full bg-ok-soft px-2.5 text-xs font-semibold text-ok">
        No flagged results
      </span>
    );
  }
  return (
    <Menu align="start" trigger={trigger(all.length)} className="min-w-64">
      {all.slice(0, MAX_ROWS).map((lab) => (
        <MenuItem
          key={lab.lab_id}
          render={<Link href={`${base}?tab=labs&lab=${encodeURIComponent(lab.code)}`} />}
          className="justify-between gap-4"
        >
          <span className="font-medium">{lab.test}</span>
          <span className="text-crit tabular-nums">
            {formatValue(lab.value, lab.unit)} {lab.flag === "HIGH" ? "↑ High" : "↓ Low"}
            <span className="sr-only"> on {formatShortDate(lab.date)}</span>
          </span>
        </MenuItem>
      ))}
      <MenuItem render={<Link href={`${base}?tab=safety`} />} className="font-medium text-primary">
        View attention details
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </MenuItem>
    </Menu>
  );
}
