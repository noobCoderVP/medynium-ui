import { describe, expect, it } from "vitest";
import { drugName, recordLabel, sourceHrefFor, sourceLabel } from "./evidence-label";

describe("evidence labels", () => {
  it("names the drug from a label title", () => {
    expect(drugName("Lisinopril tablets: prescribing information")).toBe("Lisinopril");
    expect(drugName("Atorvastatin calcium tablets: prescribing information")).toBe(
      "Atorvastatin calcium",
    );
    expect(drugName("Metformin")).toBe("Metformin");
  });

  it("builds a readable source label and a search link", () => {
    const item = {
      title: "Lisinopril tablets: prescribing information",
      section: "Warnings and precautions",
    } as Parameters<typeof sourceLabel>[0];
    expect(sourceLabel(item)).toBe("Lisinopril label · Warnings and precautions");
    expect(sourceHrefFor(item)).toBe("/knowledge?q=Lisinopril%20Warnings%20and%20precautions");
  });

  it("keeps a record value on one line and adds its date only when the value has none", () => {
    const base = { evidence_id: "P1", record_type: "Lab", record_id: "L", table: "T" };
    expect(recordLabel({ ...base, value: "Allergy to penicillin", date: "2026-09-14" })).toMatch(
      /14 Sep/,
    );
    expect(recordLabel({ ...base, value: "eGFR 42 on 14 Sep 2026", date: "2026-09-14" })).toBe(
      "eGFR 42 on 14 Sep 2026",
    );
    expect(recordLabel({ ...base, value: "x".repeat(200), date: null }).length).toBeLessThan(75);
  });
});
