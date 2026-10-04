import { TriangleAlert } from "lucide-react";
import type { Overview } from "@/lib/api/types";

/** An empty list is "none recorded", never "none known": the wording must not read as reassurance. */
export const NO_ALLERGIES = "No allergies recorded";

function describe(allergy: Overview["allergies"][number]): string {
  const detail = [allergy.reaction, allergy.severity?.toLowerCase()].filter(Boolean).join(", ");
  return detail ? `${allergy.substance} (${detail})` : allergy.substance;
}

/**
 * Allergies sit on the patient's identity line on every tab, because they matter before any other detail. They are
 * shown as text with an icon, and the most severe come first (the server orders them).
 */
export function AllergyBanner({ allergies }: { allergies: Overview["allergies"] }) {
  if (allergies.length === 0) {
    return <span className="text-muted-foreground">{NO_ALLERGIES}</span>;
  }
  return (
    <section
      aria-label="Allergies"
      className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md bg-warn-soft px-2 py-0.5 font-medium text-warn"
    >
      <TriangleAlert className="size-3.5" aria-hidden="true" />
      <h2 className="sr-only">Allergies</h2>
      <ul className="flex flex-wrap gap-x-3">
        {allergies.map((allergy) => (
          <li key={allergy.allergy_id}>{describe(allergy)}</li>
        ))}
      </ul>
    </section>
  );
}
