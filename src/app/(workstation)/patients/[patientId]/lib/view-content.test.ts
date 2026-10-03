import { describe, expect, it } from "vitest";
import { contentFromParams, hrefFromContent } from "./view-content";

describe("saved view content", () => {
  it("keeps the tab and its filters and drops the evidence drawer params", () => {
    const params = new URLSearchParams("tab=timeline&from=2026-01-01&why=ANS-1&ref=P2");
    expect(contentFromParams(params, "Jan")).toEqual({
      title: "Jan",
      tab: "timeline",
      params: { from: "2026-01-01" },
    });
  });

  it("round-trips to a link", () => {
    const content = contentFromParams(new URLSearchParams("tab=labs&lab=33914-3"), "eGFR");
    expect(hrefFromContent("P-1", content)).toBe("/patients/P-1?tab=labs&lab=33914-3");
  });

  it("falls back to the overview for unknown content", () => {
    expect(hrefFromContent("P-1", { tab: "nonsense" })).toBe("/patients/P-1?tab=overview");
  });
});
