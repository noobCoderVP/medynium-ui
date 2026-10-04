import { describe, expect, it } from "vitest";
import type { LabLatest } from "@/lib/api/types";
import { summarize } from "./summary";

const lab = (flag: LabLatest["flag"], value: number, previous: number | null) =>
  ({
    flag,
    value,
    previous: previous === null ? null : { value: previous, date: "2026-08-15" },
  }) as LabLatest;

describe("summarize", () => {
  it("counts abnormal results and values that rose", () => {
    const rows = [
      lab("HIGH", 1.6, 1.8),
      lab("NORMAL", 83, 82),
      lab("LOW", 3, null),
      lab(null, 1, 1),
    ];
    expect(summarize(rows)).toEqual({ abnormal: 2, rising: 1 });
  });
});
