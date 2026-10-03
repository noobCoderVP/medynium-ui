import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext (no open redirect)", () => {
  it("keeps a same-origin path, with its query", () => {
    expect(safeNext("/patients/P-1?tab=labs")).toBe("/patients/P-1?tab=labs");
  });
  it.each([
    undefined,
    "",
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
  ])("falls back to the dashboard for %s", (value) => {
    expect(safeNext(value)).toBe("/dashboard");
  });
});
