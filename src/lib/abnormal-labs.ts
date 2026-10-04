import type { Overview } from "@/lib/api/types";
import { formatDate, formatValue } from "@/lib/format";

type Lab = Overview["latest_labs"][number];

/** Labs outside their reference range, in the order the server sent them. */
export function abnormalLabs(labs: Lab[]): Lab[] {
  return labs.filter((lab) => lab.flag === "HIGH" || lab.flag === "LOW");
}

/** "↑ 0.7" style movement against the previous result, or null when there is no previous value. */
export function labDelta(lab: Lab): { arrow: "↑" | "↓" | "→"; text: string } | null {
  if (!lab.previous) return null;
  const diff = lab.value - lab.previous.value;
  const arrow = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
  return { arrow, text: `${arrow} ${formatValue(Math.abs(diff))}` };
}

/** The reference range as text, e.g. "0.6–1.3", or null when the server has none. */
export function refRange(lab: Lab): string | null {
  const { low, high } = lab.ref;
  if (low === null && high === null) return null;
  if (low === null) return `≤ ${formatValue(high)}`;
  if (high === null) return `≥ ${formatValue(low)}`;
  return `${formatValue(low)}–${formatValue(high)}`;
}

/** Why a flagged result matters, stated only from recorded values: the range and the change since last time. */
export function whyItMatters(lab: Lab): string {
  const side = lab.flag === "HIGH" ? "above" : "below";
  const range = refRange(lab);
  const parts = [`${side} the reference range${range ? ` (${range})` : ""}`];
  if (lab.previous) {
    const delta = labDelta(lab);
    parts.push(
      `${delta?.arrow === "↑" ? "up" : delta?.arrow === "↓" ? "down" : "unchanged"} from ${formatValue(lab.previous.value, lab.unit)} on ${formatDate(lab.previous.date)}`,
    );
  }
  return parts.join(", ");
}
