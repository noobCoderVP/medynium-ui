"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import { easeOut } from "@/lib/motion";
import type { SortOrder } from "@/lib/use-list-state";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Local sort: present when the page in hand can be sorted by this column. Ignored in server mode. */
  sortValue?: (row: T) => string | number;
  /** Server sort: the key the API accepts for `sort=`. Present when the column can be sorted by the API. */
  sortKey?: string;
  /** Numbers and money align right, status chips centre, text stays left (default). */
  align?: "center" | "right";
  /** Intentional column width, for example "24%" or "9rem". Columns without one share what is left. */
  width?: string;
  /** Floor for the column so a narrow window scrolls instead of crushing it. */
  minWidth?: string;
  className?: string;
  /** On a phone card: "secondary" shows the cell smaller and muted, so the key fields lead. Default is full size. */
  mobile?: "secondary";
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Names the table for screen readers. */
  caption: string;
  /** Local sort of the rows in hand. For a paged list use `sort` and `onSort` instead. */
  initialSort?: { key: string; direction: "asc" | "desc" };
  /** Server sort: the API orders every row, so the table shows this order as given. */
  sort?: { key: string; order: SortOrder };
  onSort?: (key: string) => void;
  /** The row whose key matches is marked as current (for example a record opened from the timeline). */
  highlightKey?: string;
  /** "compact" tightens rows for dense lists such as the audit log. Default is comfortable. */
  density?: "comfortable" | "compact";
  /** Scroll inside the parent instead of growing the page: the header stays pinned. From 1024 px; the parent needs a bounded height. */
  fill?: boolean;
  /** The parent supplies the box (a panel), so the table draws no border or shadow of its own. */
  bare?: boolean;
  /** Extra classes for one row, for example a left-border marker. */
  rowClassName?: (row: T) => string | undefined;
}

const ALIGN = { center: "text-center", right: "text-right" } as const;

/**
 * A semantic table. Sorting is a real button in the header (keyboard operable, announced through aria-sort).
 * Opening a row is a link or button inside a cell, never a click handler on the row.
 *
 * With `sort` and `onSort` the order is the API's (it sorts all rows, then pages). Under 768 px each row becomes a
 * labelled card, so nothing scrolls sideways; the roles keep it a table for assistive technology.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  initialSort,
  sort: serverSort,
  onSort,
  highlightKey,
  density = "comfortable",
  fill,
  bare,
  rowClassName,
}: Props<T>) {
  const [localSort, setLocalSort] = useState(initialSort ?? null);
  const server = Boolean(onSort);
  const active = server
    ? serverSort
      ? { key: serverSort.key, direction: serverSort.order }
      : null
    : localSort;

  const sorted = useMemo(() => {
    if (server) return rows;
    const column = columns.find((c) => c.key === localSort?.key);
    if (!localSort || !column?.sortValue) return rows;
    const value = column.sortValue;
    const factor = localSort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const [x, y] = [value(a), value(b)];
      return (x < y ? -1 : x > y ? 1 : 0) * factor;
    });
  }, [columns, rows, localSort, server]);

  const toggle = (key: string) =>
    setLocalSort((current) =>
      current?.key === key && current.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" },
    );

  const fixed = columns.some((c) => c.width);

  return (
    <div
      className={cn(
        "overflow-x-auto bg-card max-md:overflow-visible max-md:border-0 max-md:bg-transparent max-md:shadow-none",
        bare ? "md:rounded-b-xl" : "rounded-xl border border-border shadow-sm",
        fill && "lg:max-h-full lg:overflow-y-auto",
      )}
    >
      <table
        role="table"
        className={cn(
          "w-full border-separate border-spacing-0 text-sm max-md:block",
          fixed && "md:table-fixed",
        )}
      >
        <caption className="sr-only">{caption}</caption>
        {fixed ? (
          <colgroup className="max-md:hidden">
            {columns.map((column) => (
              <col key={column.key} style={{ width: column.width, minWidth: column.minWidth }} />
            ))}
          </colgroup>
        ) : null}
        <thead
          role="rowgroup"
          className="bg-table-head text-left text-xs font-semibold tracking-wider text-table-head-foreground uppercase max-md:sr-only"
        >
          <tr role="row">
            {columns.map((column, i) => {
              const sortKey = server ? column.sortKey : column.sortValue ? column.key : undefined;
              const isActive = sortKey !== undefined && active?.key === sortKey;
              const Icon = !isActive
                ? ChevronsUpDown
                : active?.direction === "asc"
                  ? ArrowUp
                  : ArrowDown;
              return (
                <th
                  key={column.key}
                  role="columnheader"
                  scope="col"
                  aria-sort={
                    isActive
                      ? active?.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className={cn(
                    "border-b-2 border-b-border bg-table-head px-4 py-3 font-semibold whitespace-nowrap",
                    fill && "lg:sticky lg:top-0 lg:z-10",
                    i > 0 && "border-l border-l-border/60",
                    column.align && ALIGN[column.align],
                  )}
                >
                  {sortKey !== undefined ? (
                    <button
                      type="button"
                      onClick={() => (server ? onSort?.(sortKey) : toggle(column.key))}
                      className={cn(
                        "-mx-1.5 inline-flex min-h-7 items-center gap-1 rounded-md px-1.5 transition-colors hover:bg-foreground/10",
                        isActive && "text-heading",
                      )}
                    >
                      {column.header}
                      <Icon
                        className={cn("size-3", !isActive && "opacity-50")}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody role="rowgroup" className="max-md:block max-md:space-y-3">
          {sorted.map((row) => (
            <motion.tr
              key={rowKey(row)}
              role="row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={easeOut}
              aria-current={rowKey(row) === highlightKey ? "true" : undefined}
              className={cn(
                "group/row align-middle transition-colors even:bg-muted/40 hover:bg-accent/50 max-md:even:bg-card",
                density === "compact" ? "h-10" : "h-12",
                "max-md:block max-md:h-auto max-md:rounded-xl max-md:border max-md:bg-card max-md:py-1.5",
                rowKey(row) === highlightKey &&
                  "bg-accent shadow-[inset_3px_0_0_var(--primary)] even:bg-accent hover:bg-accent",
                rowClassName?.(row),
              )}
            >
              {columns.map((column, i) => (
                <td
                  key={column.key}
                  role="cell"
                  data-label={i === 0 ? undefined : column.header}
                  className={cn(
                    "border-b border-border px-4 group-last/row:border-b-0",
                    density === "compact" ? "py-1.5" : "py-2.5",
                    i > 0 && "border-l border-l-border/40",
                    column.align && ALIGN[column.align],
                    "max-md:border-0 max-md:border-l-0",
                    column.className,
                    column.mobile === "secondary" && "max-md:text-xs max-md:text-muted-foreground",
                    i === 0
                      ? "max-md:block max-md:px-3.5 max-md:pt-2 max-md:pb-1 max-md:text-base max-md:font-medium"
                      : "max-md:flex max-md:max-w-none max-md:items-baseline max-md:justify-between max-md:gap-4 max-md:px-3.5 max-md:py-1.5 max-md:text-right max-md:before:shrink-0 max-md:before:text-left max-md:before:text-xs max-md:before:font-medium max-md:before:text-muted-foreground max-md:before:content-[attr(data-label)]",
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
