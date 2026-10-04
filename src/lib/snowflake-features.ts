export interface SnowflakeFeature {
  name: string;
  /** Short enough for a chip on the sign-in page. */
  tagline: string;
  /** What it does in Medynium, for the documentation table. */
  role: string;
  /** Where the user meets it. */
  where: string;
}

/** The Snowflake features Medynium runs on, in one place so sign-in, the assistant and the docs stay in step. */
export const SNOWFLAKE_FEATURES: SnowflakeFeature[] = [
  {
    name: "Cortex Analyst",
    tagline: "Natural language → insights",
    role: "Turns a plain-language question about a patient into SQL over a governed semantic view, so numbers come from the record and not from a model's memory.",
    where: "Assistant answers about labs, medicines and changes",
  },
  {
    name: "Cortex Search",
    tagline: "Evidence-backed retrieval",
    role: "Finds the right passages in the indexed drug labels and returns them as quoted, dated sources.",
    where: "Knowledge search and Retrieved source evidence",
  },
  {
    name: "Cortex AI",
    tagline: "Clinical reasoning & synthesis",
    role: "A small model routes each question; a stronger model drafts the safety review. Both run through Snowflake, so patient data stays inside the platform.",
    where: "Assistant routing and the Safety review",
  },
  {
    name: "Vector Search",
    tagline: "Find similar patients",
    role: "Snowflake Arctic embeddings and vector similarity find patients with a comparable profile.",
    where: "Similar patients tab on a patient",
  },
  {
    name: "Document AI",
    tagline: "Extract clinical evidence",
    role: "Extracts text and layout from an uploaded report so a person can review it before anything is recorded.",
    where: "Reports tab on a patient, where a doctor approves each row",
  },
  {
    name: "Row Access Policies",
    tagline: "Governed patient access",
    role: "Each person signs in under their own Snowflake role, and a row access policy shows them only the patients assigned to them. The assistant inherits the same limit.",
    where: "Every screen; a denied patient looks missing",
  },
];
