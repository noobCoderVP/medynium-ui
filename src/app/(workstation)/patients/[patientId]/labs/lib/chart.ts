import { formatDate, formatValue } from "@/lib/format";
import type { LabTrend } from "@/lib/api/types";

export const CHART = { width: 640, height: 260, left: 52, right: 16, top: 16, bottom: 34 } as const;

export interface PlotPoint {
  id: string;
  date: string;
  value: number;
  x: number;
  y: number;
}

export interface Plot {
  points: PlotPoint[];
  ticks: { value: number; y: number }[];
  /** The reference band as pixel edges, or null when the range is unknown. */
  band: { top: number; bottom: number } | null;
  /** A single reference bound drawn as a line when only one side is known. */
  line: number | null;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Pure layout for the trend chart: dates map to x, values (and the reference range) to y. */
export function layoutChart(trend: LabTrend): Plot {
  const { left, right, top, bottom, width, height } = CHART;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const sorted = [...trend.points].sort((a, b) => a.date.localeCompare(b.date));
  const { low, high } = trend.ref;

  const values = [
    ...sorted.map((p) => p.value),
    ...(low === null ? [] : [low]),
    ...(high === null ? [] : [high]),
  ];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min || Math.abs(max) || 1) * 0.1;
  const [lo, hi] = [min - pad, max + pad];
  const y = (v: number) => top + plotH - ((v - lo) / (hi - lo)) * plotH;

  const times = sorted.map((p) => Date.parse(p.date));
  const t0 = Math.min(...times);
  const span = Math.max(...times) - t0;
  const x = (t: number) => (span === 0 ? left + plotW / 2 : left + ((t - t0) / span) * plotW);

  return {
    points: sorted.map((p, i) => ({
      id: p.lab_id,
      date: p.date,
      value: p.value,
      x: x(times[i]),
      y: y(p.value),
    })),
    ticks: Array.from({ length: 4 }, (_, i) => {
      const value = lo + ((hi - lo) * i) / 3;
      return { value, y: y(value) };
    }),
    band:
      low !== null && high !== null
        ? { top: clamp(y(high), top, top + plotH), bottom: clamp(y(low), top, top + plotH) }
        : null,
    line: low !== null && high === null ? y(low) : high !== null && low === null ? y(high) : null,
  };
}

/** Where the latest value sits against the reference range, in words. */
function position(value: number, ref: LabTrend["ref"]): string {
  if (ref.low !== null && value < ref.low) return "below the reference range";
  if (ref.high !== null && value > ref.high) return "above the reference range";
  return ref.low === null && ref.high === null
    ? "with no reference range on record"
    : "within the reference range";
}

/** The text alternative to the chart: counts, span, latest value against range, and the last change. */
export function summarize(trend: LabTrend): string {
  const points = [...trend.points].sort((a, b) => a.date.localeCompare(b.date));
  if (points.length === 0) return `${trend.test}: no results on record.`;
  const last = points[points.length - 1];
  const unit = trend.unit;
  const range =
    trend.ref.low !== null || trend.ref.high !== null
      ? ` (reference ${trend.ref.low ?? "no lower limit"} to ${trend.ref.high ?? "no upper limit"})`
      : "";
  const head = `${trend.test}: ${points.length} result${points.length === 1 ? "" : "s"}${
    points.length > 1 ? ` from ${formatDate(points[0].date)} to ${formatDate(last.date)}` : ""
  }. Latest ${formatValue(last.value, unit)} on ${formatDate(last.date)}, ${position(last.value, trend.ref)}${range}.`;
  if (points.length < 2) return head;
  const prev = points[points.length - 2];
  const delta = last.value - prev.value;
  const direction = delta === 0 ? "unchanged" : delta > 0 ? "up" : "down";
  const pct = prev.value === 0 ? "" : ` (${Math.abs((delta / prev.value) * 100).toFixed(1)}%)`;
  return `${head} Change since the previous result on ${formatDate(prev.date)}: ${
    delta === 0 ? direction : `${direction} ${formatValue(Math.abs(delta))}${pct}`
  }.`;
}
