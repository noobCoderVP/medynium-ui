import { TriangleAlert } from "lucide-react";
import type { Overview } from "@/lib/api/types";

/** An empty list is "none recorded", never "none known": the wording must not read as reassurance. */
export const NO_ALLERGIES = "No allergies recorded";

function describe(allergy: Overview["allergies"][number]): string {
  const detail = [allergy.reaction, allergy.severity?.toLowerCase()].filter(Boolean).join(", ");
  return detail ? `${allergy.substance} (${detail})` : allergy.substance;
}

/**
 * Allergies sit under the patient's name on every tab, because they matter before any other detail. They are
 * shown as text with an icon, and the most severe come first (the server orders them).
 */
export function AllergyBanner({ allergies }: { allergies: Overview["allergies"] }) {
  if (allergies.length === 0) {
    return (
      <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        {NO_ALLERGIES}
      </p>
    );
  }
  return (
    <section
      aria-label="Allergies"
      className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-warn/30 bg-warn-soft px-4 py-2 text-sm text-warn"
    >
      <h2 className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
        <TriangleAlert className="size-3.5" aria-hidden="true" />
        Allergies
      </h2>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {allergies.map((allergy) => (
          <li key={allergy.allergy_id} className="font-medium">
            {describe(allergy)}
          </li>
        ))}
      </ul>
    </section>
  );
}
