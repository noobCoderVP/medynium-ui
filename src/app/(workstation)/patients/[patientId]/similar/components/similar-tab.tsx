"use client";

import Link from "next/link";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import type { SimilarPatient } from "@/lib/api/types";
import { useSimilar } from "../hooks/use-similar";

function Match({ item }: { item: SimilarPatient }) {
  return (
    <li className="space-y-2 rounded-xl border border-border bg-card p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">
          <Link
            className="underline-offset-2 hover:underline"
            href={`/patients/${item.patient_id}`}
          >
            {item.name}
          </Link>{" "}
          <span className="font-normal text-muted-foreground">
            {item.patient_id}
            {item.age !== null ? ` · ${item.age}` : ""}
            {item.sex ? ` · ${item.sex}` : ""}
          </span>
        </p>
        <p className="text-sm tabular-nums" aria-label={`Match score ${item.score.toFixed(2)}`}>
          Match {Math.round(item.score * 100)}%
        </p>
      </div>
      <ul className="list-disc space-y-0.5 pl-5 text-sm">
        {item.why.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      {item.lab_comparison.length > 0 ? (
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Latest lab values, this patient and the match</caption>
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="py-1 font-medium">Test</th>
              <th className="py-1 font-medium">This patient</th>
              <th className="py-1 font-medium">Match</th>
            </tr>
          </thead>
          <tbody>
            {item.lab_comparison.map((lab) => (
              <tr key={lab.test} className="border-t border-border">
                <td className="py-1">{lab.test}</td>
                <td className="py-1 tabular-nums">
                  {lab.this_value} {lab.unit ?? ""} {lab.this_flag ? `(${lab.this_flag})` : ""}
                </td>
                <td className="py-1 tabular-nums">
                  {lab.other_value} {lab.unit ?? ""} {lab.other_flag ? `(${lab.other_flag})` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </li>
  );
}

export function SimilarTab({ patientId }: { patientId: string }) {
  const query = useSimilar(patientId);
  return (
    <DataState
      query={query}
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
          <ul className="space-y-3">
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
