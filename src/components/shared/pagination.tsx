"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { formatNumber } from "@/lib/format";
import { PAGE_SIZES } from "@/lib/use-list-state";

interface Props {
  total: number;
  offset: number;
  limit: number;
  onOffsetChange: (offset: number) => void;
  onLimitChange?: (limit: number) => void;
  /** Names the list for screen readers, for example "patients". */
  noun?: string;
}

/** Page numbers to show: first, last and a window around the current page, with gaps as null. */
function pageWindow(page: number, pages: number): (number | null)[] {
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const sorted = [...keep].sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? [null, n] : [n]));
}

/**
 * Range, page-size and page controls for a server-paged list. The total always comes from the API, so "of 312"
 * is the whole filtered set, not the rows in hand. Buttons are 40 px high on phones for thumbs.
 */
export function Pagination({
  total,
  offset,
  limit,
  onOffsetChange,
  onLimitChange,
  noun = "results",
}: Props) {
  const id = useId();
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(pages, Math.floor(offset / limit) + 1);
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);
  const go = (target: number) => onOffsetChange((Math.min(Math.max(target, 1), pages) - 1) * limit);
  const sizes = PAGE_SIZES.includes(limit as (typeof PAGE_SIZES)[number])
    ? PAGE_SIZES
    : [...PAGE_SIZES, limit].sort((a, b) => a - b);
  const button = "max-sm:h-10 max-sm:min-w-10";
  const ends = "max-sm:hidden";

  return (
    <nav
      aria-label={`Pages of ${noun}`}
      className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="font-medium text-foreground" aria-live="polite">
        {total === 0
          ? `No ${noun}`
          : `Showing ${formatNumber(from)}–${formatNumber(to)} of ${formatNumber(total)} ${noun}`}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {onLimitChange && total > PAGE_SIZES[0] ? (
          <div className="flex items-center gap-2">
            <label htmlFor={id} className="text-muted-foreground">
              Rows per page
            </label>
            <Select
              id={id}
              className="h-8 w-auto py-0 max-sm:h-10"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>
        ) : null}
        {pages > 1 ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className={`${button} ${ends}`}
              aria-label="First page"

              disabled={page === 1}
              onClick={() => go(1)}
            >
              <ChevronsLeft aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={button}
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => go(page - 1)}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <span className="px-2 whitespace-nowrap tabular-nums sm:hidden">
              Page {formatNumber(page)} of {formatNumber(pages)}
            </span>
            <ol className="hidden items-center gap-1 sm:flex">
              {pageWindow(page, pages).map((entry, i) =>
                entry === null ? (
                  <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted-foreground">
                    …
                  </li>
                ) : (
                  <li key={entry}>
                    <Button
                      variant={entry === page ? "default" : "ghost"}
                      size="icon"
                      aria-label={`Page ${entry}`}
                      aria-current={entry === page ? "page" : undefined}
                      className="tabular-nums"
                      onClick={() => go(entry)}
                    >
                      {entry}
                    </Button>
                  </li>
                ),
              )}
            </ol>
            <Button
              variant="outline"
              size="icon"
              className={button}
              aria-label="Next page"
              disabled={page === pages}
              onClick={() => go(page + 1)}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`${button} ${ends}`}
              aria-label="Last page"
              disabled={page === pages}
              onClick={() => go(pages)}
            >
              <ChevronsRight aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
