import { SNOWFLAKE_FEATURES } from "@/lib/snowflake-features";
import type { DocSection } from "../types";

/** What Medynium runs on. Written for a reader who is not an engineer; the feature list is shared with sign-in. */
export const PLATFORM_SECTIONS: DocSection[] = [
  {
    id: "built-on-snowflake",
    group: "platform",
    title: "Built on Snowflake",
    summary: "The Snowflake features behind each part of the product.",
    topics: [
      {
        title: "Why one platform",
        body: "Patient records, drug labels, access rules, audit history and the AI models all live in Snowflake. Nothing is copied out to a separate search or AI service, so the rules that protect a record also apply to the assistant.",
      },
      {
        title: "Built with Cortex Code",
        body: "The platform was set up, tested and audited with Snowflake's Cortex Code CLI. It is a build tool only and takes no part in producing an answer.",
      },
    ],
    table: {
      columns: ["Snowflake feature", "What it does in Medynium", "Where you see it"],
      rows: SNOWFLAKE_FEATURES.map((f) => [f.name, f.role, f.where]),
    },
  },
  {
    id: "architecture",
    group: "platform",
    title: "Architecture",
    summary: "How a request travels from your screen to Snowflake and back.",
    figure: "architecture",
    topics: [
      {
        title: "The request path",
        body: "Your browser or phone talks only to the Medynium app. The app calls the Medynium API, and the API connects to Snowflake under your own role. The app never connects to Snowflake and holds no secrets.",
      },
      {
        title: "Four data areas",
        body: "Security holds users, invitations, sessions and patient assignments. Clinical holds the synthetic patient record. Knowledge holds the public drug labels. Analytics holds precomputed views, saved answers and the audit trail.",
      },
      {
        title: "Models",
        body: "A small Llama-class model routes each question, a larger Llama model plans and reads uploaded reports, and a Claude model drafts the safety review. The choice of model is configuration and can change without changing what you see.",
      },
    ],
  },
];
