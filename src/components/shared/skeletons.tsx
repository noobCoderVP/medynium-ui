import { Skeleton } from "@/components/ui/skeleton";

/** A toolbar strip and a table of rows, so a list page keeps its shape while it loads. */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-full" />
      <div className="overflow-hidden rounded-xl border border-border">
        <Skeleton className="h-11 w-full rounded-none" />
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="mt-px h-12 w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}

/** A grid of card blocks, for overview and similar-patient pages. */
export function CardsSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: cards }, (_, i) => (
        <Skeleton key={i} className="h-44 w-full" />
      ))}
    </div>
  );
}

/** The patient header and tab bar, shown while the patient loads. */
export function WorkspaceSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <CardsSkeleton />
    </div>
  );
}
