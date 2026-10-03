import { describe, expect, it } from "vitest";
import type { LabTrend } from "@/lib/api/types";
import { CHART, layoutChart, summarize } from "./chart";

const egfr: LabTrend = {
  test: "eGFR",
  code: "33914-3",
  unit: "mL/min/1.73 m²",
  ref: { low: 60, high: 120 },
  points: [
    { lab_id: "L3", date: "2026-09-14", value: 42 },
    { lab_id: "L1", date: "2025-03-02", value: 70 },
    { lab_id: "L2", date: "2026-03-10", value: 58 },
  ],
};

describe("layoutChart", () => {
  it("orders points by date and keeps them inside the plot area", () => {
    const plot = layoutChart(egfr);
    expect(plot.points.map((p) => p.id)).toEqual(["L1", "L2", "L3"]);
    for (const p of plot.points) {
      expect(p.x).toBeGreaterThanOrEqual(CHART.left);
      expect(p.x).toBeLessThanOrEqual(CHART.width - CHART.right);
      expect(p.y).toBeGreaterThanOrEqual(CHART.top);
      expect(p.y).toBeLessThanOrEqual(CHART.height - CHART.bottom);
    }
  });

  it("puts a higher value higher on the chart (smaller y)", () => {
    const [first, , last] = layoutChart(egfr).points;
    expect(first.y).toBeLessThan(last.y);
  });

  it("draws a band for a full range and a line for one bound", () => {
    expect(layoutChart(egfr).band).not.toBeNull();
    const oneSided = layoutChart({ ...egfr, ref: { low: 60, high: null } });
    expect(oneSided.band).toBeNull();
    expect(oneSided.line).not.toBeNull();
  });

  it("centres a single point instead of dividing by zero", () => {
    const plot = layoutChart({ ...egfr, points: [egfr.points[0]] });
    expect(Number.isFinite(plot.points[0].x)).toBe(true);
  });
});

describe("summarize", () => {
  it("states the span, latest value against the range and the last change", () => {
    const text = summarize(egfr);
    expect(text).toMatch(/3 results from 2 Mar 2025 to 14 Sep(t)? 2026/);
    expect(text).toMatch(
      /Latest 42 mL\/min\/1\.73 m² on 14 Sep(t)? 2026, below the reference range/,
    );
    expect(text).toContain("down 16 (27.6%)");
  });

  it("handles no results", () => {
    expect(summarize({ ...egfr, points: [] })).toBe("eGFR: no results on record.");
  });
});
