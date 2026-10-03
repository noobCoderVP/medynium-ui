import { formatDate } from "@/lib/format";
import type { EncounterRef } from "@/lib/api/types";

const KIND = {
  OUTPATIENT: "Outpatient",
  EMERGENCY: "Emergency",
  HOSPITALIZATION: "Hospital stay",
} as const;

/** The last encounter: its date, then the kind in plain words. */
export function EncounterCell({ encounter }: { encounter: EncounterRef }) {
  return (
    <span>
      {formatDate(encounter.date)}
      {encounter.kind ? (
        <span className="text-muted-foreground"> · {KIND[encounter.kind]}</span>
      ) : null}
    </span>
  );
}
