import type { DocGroupId } from "../types";

/** The order the contents list and the page follow. */
export const DOC_GROUPS: { id: DocGroupId; label: string }[] = [
  { id: "guide", label: "Using Medynium" },
  { id: "platform", label: "Platform" },
  { id: "trust", label: "Trust and safety" },
  { id: "reference", label: "Reference" },
];
