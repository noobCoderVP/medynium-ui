"use client";

import { useEffect, useState, type ReactNode } from "react";
import { isAgentUnavailable, isNotFound, isRateLimited, ApiError } from "@/lib/api/errors";
import { copy } from "@/lib/copy";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AgentUnavailable,
  EmptyState,
  ErrorState,
  NotFoundState,
  RateLimited,
} from "./state-panels";

/** The slice of a React Query result that DataState needs. */
export interface QueryLike<T> {
  isPending: boolean;
  isError: boolean;
  error: unknown;
  data: T | undefined;
  refetch: () => unknown;
}

interface Props<T> {
  query: QueryLike<T>;
  /** Skeleton that matches the final layout. */
  skeleton?: ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  /** Used for a 404; patient screens pass the shared not-found state. */
  notFound?: ReactNode;
  children: (data: T) => ReactNode;
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

/** A progress note after 3 seconds, so a slow warehouse does not look like a hang (05 section 7.3). */
function Loading({ skeleton }: { skeleton: ReactNode }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      {skeleton}
      {slow ? <p className="mt-3 text-sm text-muted-foreground">{copy.loadingSlow}</p> : null}
    </div>
  );
}

/**
 * The state matrix in one place (05 section 7.3): loading, empty, not found, rate limited, agent unavailable,
 * and error with retry. Screens render their populated view as children.
 */
export function DataState<T>({ query, skeleton, isEmpty, empty, notFound, children }: Props<T>) {
  if (query.isPending) return <Loading skeleton={skeleton ?? <SkeletonRows />} />;
  if (query.isError) {
    const retry = () => void query.refetch();
    if (isNotFound(query.error))
      return (
        <>
          {notFound ?? (
            <NotFoundState title={copy.notFound.page.title} body={copy.notFound.page.body} />
          )}
        </>
      );
    if (isRateLimited(query.error))
      return (
        <RateLimited
          seconds={query.error instanceof ApiError ? query.error.retryAfter : null}
          onRetry={retry}
        />
      );
    if (isAgentUnavailable(query.error)) return <AgentUnavailable onRetry={retry} />;
    return <ErrorState error={query.error} onRetry={retry} />;
  }
  const data = query.data as T;
  if (isEmpty?.(data)) return <>{empty ?? <EmptyState title="Nothing to show" />}</>;
  return <>{children(data)}</>;
}
