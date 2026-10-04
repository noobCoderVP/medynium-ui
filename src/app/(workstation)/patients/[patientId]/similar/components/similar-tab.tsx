"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatusChip } from "@/components/shared/chips";
import { CardsSkeleton } from "@/components/shared/skeletons";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import type { SimilarPatient } from "@/lib/api/types";
import { useSimilar } from "../hooks/use-similar";

const flagTone = (flag: string | null | undefined) =>
  flag === "HIGH" ? "crit" : flag === "LOW" ? "info" : "muted";

function LabValue({
  value,
  unit,
  flag,
}: {
  value: string | number;
  unit: string | null;
  flag: string | null | undefined;
}) {
  return (
    <span className="inline-flex items-center gap-2 tabular-nums">
      <span className="font-medium">
        {value} {unit ?? ""}
      </span>
      {flag ? <StatusChip tone={flagTone(flag)}>{flag.toLowerCase()}</StatusChip> : null}
    </span>
  );
}

/** Patient first, then why they are similar, then the lab comparison. The match score is deliberately last. */
function Match({ item }: { item: SimilarPatient }) {
  return (
    <li className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-base font-semibold">
          <Link className="text-primary hover:underline" href={`/patients/${item.patient_id}`}>
            {item.name}
          </Link>{" "}
          <span className="text-sm font-normal text-muted-foreground">
            <span className="font-mono">{item.patient_id}</span>
            {item.age !== null ? ` · ${item.age}` : ""}
            {item.sex ? ` · ${item.sex}` : ""}
          </span>
        </p>
        <StatusChip tone="muted">{`Match ${Math.round(item.score * 100)}%`}</StatusChip>
      </div>
      <div>
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Similar because
        </h3>
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm">
          {item.why.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
      {item.lab_comparison.length > 0 ? (
        <table className="w-full overflow-hidden rounded-lg border border-border text-left text-sm">
          <caption className="sr-only">Latest lab values, this patient and the match</caption>
          <thead className="bg-table-head text-xs text-table-head-foreground uppercase">
            <tr>
              <th className="px-3 py-1.5 font-semibold">Measure</th>
              <th className="px-3 py-1.5 font-semibold">This patient</th>
              <th className="px-3 py-1.5 font-semibold">{item.name}</th>
            </tr>
          </thead>
          <tbody>
            {item.lab_comparison.map((lab) => (
              <tr key={lab.test} className="border-t border-border">
                <td className="px-3 py-1.5">{lab.test}</td>
                <td className="px-3 py-1.5">
                  <LabValue value={lab.this_value} unit={lab.unit} flag={lab.this_flag} />
                </td>
                <td className="px-3 py-1.5">
                  <LabValue value={lab.other_value} unit={lab.unit} flag={lab.other_flag} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      <div className="flex justify-end">
        <Link
          href={`/patients/${item.patient_id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View patient
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

export function SimilarTab({ patientId }: { patientId: string }) {
  const query = useSimilar(patientId);
  return (
    <DataState
      query={query}
      skeleton={<CardsSkeleton />}
      isEmpty={(data) => data.items.length === 0}
      empty={
        <EmptyState title="No similar patients found.">
          Only patients with a real overlap in diagnoses, medicines, labs or age are listed; the
          list is never padded.
        </EmptyState>
      }
    >
      {(data) => (
        <div className="space-y-3">
          {data.note ? (
            <p role="status" className="text-sm text-muted-foreground">
              {data.note}
            </p>
          ) : null}
          <ul className="grid gap-3 xl:grid-cols-2">
            {data.items.map((item) => (
              <Match key={item.patient_id} item={item} />
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">{data.disclaimer}</p>
        </div>
      )}
    </DataState>
  );
}
