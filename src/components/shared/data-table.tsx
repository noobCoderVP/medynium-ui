"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Present when the column can be sorted; the value decides the order. */
  sortValue?: (row: T) => string | number;
  align?: "right";
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Names the table for screen readers. */
  caption: string;
  initialSort?: { key: string; direction: "asc" | "desc" };
  /** The row whose key matches is marked as current (for example a record opened from the timeline). */
  highlightKey?: string;
}

/**
 * A semantic table. Sorting is a real button in the header (keyboard operable, announced through aria-sort).
 * Opening a row is a link or button inside a cell, never a click handler on the row.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  initialSort,
  highlightKey,
}: Props<T>) {
  const [sort, setSort] = useState(initialSort ?? null);

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.key === sort?.key);
    if (!sort || !column?.sortValue) return rows;
    const value = column.sortValue;
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const [x, y] = [value(a), value(b)];
      return (x < y ? -1 : x > y ? 1 : 0) * factor;
    });
  }, [columns, rows, sort]);

  const toggle = (key: string) =>
    setSort((current) =>
      current?.key === key && current.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" },
    );

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
          <tr>
            {columns.map((column) => {
              const active = sort?.key === column.key;
              const Icon = !active
                ? ChevronsUpDown
                : sort.direction === "asc"
                  ? ArrowUp
                  : ArrowDown;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    active ? (sort.direction === "asc" ? "ascending" : "descending") : undefined
                  }
                  className={cn("px-3 py-2 font-medium", column.align === "right" && "text-right")}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggle(column.key)}
                      className="inline-flex min-h-6 items-center gap-1 rounded hover:text-foreground"
                    >
                      {column.header}
                      <Icon className="size-3" aria-hidden="true" />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={rowKey(row)}
              aria-current={rowKey(row) === highlightKey ? "true" : undefined}
              className={cn(
                "h-10 border-t border-border align-middle",
                rowKey(row) === highlightKey && "bg-accent",
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-3 py-1.5",
                    column.align === "right" && "text-right",
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
