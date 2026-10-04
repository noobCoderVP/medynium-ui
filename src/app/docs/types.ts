export interface DocTopic {
  title: string;
  body: string;
}

export interface DocTable {
  columns: string[];
  rows: string[][];
}

export type DocGroupId = "guide" | "platform" | "trust" | "reference";

export interface DocSection {
  id: string;
  group: DocGroupId;
  title: string;
  summary: string;
  topics: DocTopic[];
  /** A comparison shown under the topics. */
  table?: DocTable;
  /** A diagram shown above the topics. */
  figure?: "architecture";
}
