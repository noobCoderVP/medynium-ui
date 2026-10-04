import { ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import type { PendingItem } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { KINDS } from "../lib/kinds";

interface Props {
  item: PendingItem;
  saving: boolean;
  /** Marking a lab reviewed is doctor-only; others still get the link to the patient. */
  canReview: boolean;
  onReview: (item: PendingItem) => void;
}

/** One thing waiting: what it is, for whom, when, and the button that deals with it. */
export function PendingRow({ item, saving, canReview, onReview }: Props) {
  const kind = KINDS[item.kind];
  const Icon = kind.icon;
  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 p-3",
        item.overdue && "shadow-[inset_3px_0_0_var(--crit)]",
      )}
    >
      <Link
        href={`/patients/${item.patient_id}`}
        className="flex w-48 shrink-0 items-center gap-2.5 max-sm:w-full"
      >
        <PatientAvatar name={item.patient_name} className="bg-muted text-foreground/70" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-primary">
            {item.patient_name}
          </span>
          <span className="block text-xs text-muted-foreground tabular-nums">
            {item.patient_id}
          </span>
        </span>
      </Link>
      <div className="min-w-0 flex-1 basis-64">
        <p className="mb-1 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "inline-flex h-6 items-center gap-1 rounded-md border px-2 text-xs font-medium whitespace-nowrap",
              kind.className,
            )}
          >
            <Icon className="size-3" aria-hidden="true" />
            {kind.label}
          </span>
          {item.overdue ? (
            <span className="inline-flex h-6 items-center rounded-md border border-crit/30 bg-crit-soft px-2 text-xs font-semibold text-crit">
              Overdue
            </span>
          ) : null}
        </p>
        <p className="text-sm font-medium">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.detail}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {item.due_date ? `Due ${formatDate(item.due_date)}` : null}
          {item.due_date && item.raised_at ? " · " : null}
          {item.raised_at ? `Raised ${formatDate(item.raised_at)}` : null}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 max-sm:w-full">
        {canReview && item.kind === "ABNORMAL_LAB" && item.source_id ? (
          <Button variant="outline" disabled={saving} onClick={() => onReview(item)}>
            {saving ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Check aria-hidden="true" />
            )}
            Mark reviewed
          </Button>
        ) : null}
        <Link href={`/patients/${item.patient_id}?tab=${kind.tab}`} className={buttonVariants()}>
          {kind.action}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}
