import { z } from "zod";

// Only NEXT_PUBLIC_* values may be read in the browser. BACKEND_URL is server-only (next.config.ts).
const schema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Medynium"),
});

export const env = schema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || undefined,
});
