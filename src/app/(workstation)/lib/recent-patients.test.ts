import { beforeEach, describe, expect, it } from "vitest";
import { readRecentPatients, rememberPatient } from "./recent-patients";

beforeEach(() => localStorage.clear());

describe("recent patients", () => {
  it("keeps the newest first, without duplicates, up to five", () => {
    for (const n of [1, 2, 3, 4, 5, 6, 3]) rememberPatient({ id: `P-${n}`, name: `Patient ${n}` });
    expect(readRecentPatients().map((p) => p.id)).toEqual(["P-3", "P-6", "P-5", "P-4", "P-2"]);
  });

  it("ignores malformed storage", () => {
    localStorage.setItem("medynium-recent-patients", '{"nope":1}');
    expect(readRecentPatients()).toEqual([]);
  });
});
