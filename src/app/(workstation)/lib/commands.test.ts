import { Users } from "lucide-react";
import { describe, expect, it } from "vitest";
import { filterCommands, type Command } from "./commands";

const make = (label: string, keywords?: string): Command => ({
  id: label,
  label,
  keywords,
  group: "Go to",
  icon: Users,
  run: () => {},
});
const all = [make("Patients"), make("Activity log", "audit history"), make("Dark theme")];

describe("filterCommands", () => {
  it("keeps everything for an empty query", () => {
    expect(filterCommands(all, "  ")).toHaveLength(3);
  });
  it("matches words in any order, in the label or keywords", () => {
    expect(filterCommands(all, "log act").map((c) => c.label)).toEqual(["Activity log"]);
    expect(filterCommands(all, "audit").map((c) => c.label)).toEqual(["Activity log"]);
  });
  it("returns nothing when a word does not match", () => {
    expect(filterCommands(all, "patients zzz")).toEqual([]);
  });
});
