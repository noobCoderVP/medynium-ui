import { Stethoscope } from "lucide-react";
import type { components } from "@/lib/api/schema";
import { cn } from "@/lib/utils";

type DoctorRef = components["schemas"]["DoctorRef"];

const WORDS: Record<DoctorRef["basis"], string> = {
  entered_by: "Entered by",
  author: "Written by",
  provider: "Seen by",
  treating: "Treating doctor",
};

/**
 * The doctor behind a record. A doctor the data names for that record is shown plainly; when the record names nobody,
 * the patient's treating doctor is shown in a lighter style and labelled as such, so it is never read as the author of
 * that particular record.
 */
export function DoctorLine({
  doctor,
  className,
}: {
  doctor: DoctorRef | null | undefined;
  className?: string;
}) {
  if (!doctor) return null;
  const fallback = doctor.basis === "treating";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs",
        fallback ? "text-muted-foreground italic" : "text-foreground/80",
        className,
      )}
      title={WORDS[doctor.basis]}
    >
      <Stethoscope className="size-3 shrink-0" aria-hidden="true" />
      <span className="sr-only">{WORDS[doctor.basis]}: </span>
      {fallback ? `Treating: ${doctor.name}` : doctor.name}
      {doctor.speciality && !fallback ? (
        <span className="text-muted-foreground"> · {doctor.speciality.toLowerCase()}</span>
      ) : null}
    </span>
  );
}
