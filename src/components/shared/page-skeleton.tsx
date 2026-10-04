import { Skeleton } from "@/components/ui/skeleton";

/** A route-level placeholder shaped like a workspace page: heading, a strip of figures and two content blocks. */
export function PageSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading page</span>
      <div className="space-y-2 border-b border-border pb-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="h-16 w-full" />
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );
}
