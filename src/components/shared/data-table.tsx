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
  align?: "right";
  className?: string;
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
}

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

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs max-md:overflow-visible max-md:border-0 max-md:bg-transparent max-md:shadow-none">
      <table role="table" className="w-full border-collapse text-sm max-md:block">
        <caption className="sr-only">{caption}</caption>
        <thead
          role="rowgroup"
          className="bg-muted/50 text-left text-xs font-medium text-muted-foreground max-md:sr-only"
        >
          <tr role="row">
            {columns.map((column) => {
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
                    "px-4 py-3 font-semibold whitespace-nowrap",
                    column.align === "right" && "text-right",
                  )}
                >
                  {sortKey !== undefined ? (
                    <button
                      type="button"
                      onClick={() => (server ? onSort?.(sortKey) : toggle(column.key))}
                      className={cn(
                        "-mx-1.5 inline-flex min-h-7 items-center gap-1 rounded-md px-1.5 transition-colors hover:bg-muted hover:text-foreground",
                        isActive && "text-foreground",
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
          {sorted.map((row, index) => (
            <motion.tr
              key={rowKey(row)}
              role="row"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeOut, delay: Math.min(index, 12) * 0.02 }}
              aria-current={rowKey(row) === highlightKey ? "true" : undefined}
              className={cn(
                "h-12 border-t border-border align-middle transition-colors hover:bg-muted/40",
                "max-md:block max-md:h-auto max-md:rounded-xl max-md:border max-md:bg-card max-md:py-1.5 max-md:shadow-xs",
                rowKey(row) === highlightKey && "bg-accent hover:bg-accent",
              )}
            >
              {columns.map((column, i) => (
                <td
                  key={column.key}
                  role="cell"
                  data-label={i === 0 ? undefined : column.header}
                  className={cn(
                    "px-4 py-2.5",
                    column.align === "right" && "text-right",
                    column.className,
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
