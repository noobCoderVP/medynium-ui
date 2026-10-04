import type { LabLatest } from "@/lib/api/types";

export const isAbnormal = (lab: LabLatest) => lab.flag === "HIGH" || lab.flag === "LOW";

/** Counts for the line above the table: how many results, how many outside range, how many rose since last time. */
export function summarize(rows: LabLatest[]) {
  return {
    abnormal: rows.filter(isAbnormal).length,
    rising: rows.filter((lab) => lab.previous && lab.value > lab.previous.value).length,
  };
}
