import { describe, expect, it } from "vitest";
import { evidenceHref, sourceHref } from "./source-link";

describe("sourceHref", () => {
  it("opens a lab on its trend", () => {
    const source = { type: "lab", id: "L1", tab: "labs", query: { lab: "eGFR" } } as const;
    expect(sourceHref("P-1", source)).toBe("/patients/P-1?tab=labs&lab=eGFR");
  });

  it("opens a note by id and the overview with no parameters", () => {
    expect(sourceHref("P-1", { type: "note", id: "N9", tab: "notes", query: {} })).toBe(
      "/patients/P-1?tab=notes&note=N9",
    );
    expect(sourceHref("P-1", { type: "diagnosis", id: null, tab: "overview", query: {} })).toBe(
      "/patients/P-1",
    );
    expect(sourceHref("P-1", null)).toBe("/patients/P-1");
  });
});

describe("evidenceHref", () => {
  it("takes the lab code from the start of the value", () => {
    const link = evidenceHref("P-1", "CLINICAL.LAB_RESULT", "L1", "eGFR 42 mL/min on 18 Sep 2026");
    expect(link?.href).toBe("/patients/P-1?tab=labs&lab=eGFR");
  });

  it("handles a two-word test name and a value with no number", () => {
    expect(evidenceHref("P-1", "CLINICAL.LAB_RESULT", "L1", "Serum sodium 139")?.href).toBe(
      "/patients/P-1?tab=labs&lab=Serum%20sodium",
    );
    expect(evidenceHref("P-1", "CLINICAL.LAB_RESULT", "L1", "abnormal")?.href).toBe(
      "/patients/P-1?tab=labs",
    );
  });

  it("maps records to their screens and gives nothing for a query result", () => {
    expect(evidenceHref("P-1", "CLINICAL.CLINICAL_NOTE", "N3", "x")?.href).toBe(
      "/patients/P-1?tab=notes&note=N3",
    );
    expect(evidenceHref("P-1", "CLINICAL.MEDICATION", "M1", "x")?.href).toBe(
      "/patients/P-1?tab=medications",
    );
    expect(evidenceHref("P-1", "ANALYTICS (Cortex Analyst)", null, "x")).toBeNull();
    expect(evidenceHref(null, "CLINICAL.MEDICATION", "M1", "x")).toBeNull();
  });
});
