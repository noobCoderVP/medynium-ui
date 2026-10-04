/** Starter searches shown before anything is typed. Each works against the indexed drug labels. */
export const EXAMPLES = [
  "metformin renal impairment",
  "Glycomet",
  "warfarin bleeding risk",
  "lisinopril angioedema",
  "pregnancy",
  "hypoglycemia",
] as const;

/** Starter questions for the assistant on this screen. Each is answered from the indexed labels. */
export const DRUG_QUESTIONS = [
  "Share details of amoxicillin",
  "Which medicines are used for high blood pressure?",
  "What is the usual adult dose of metformin?",
  "Side effects and interactions of warfarin",
] as const;
