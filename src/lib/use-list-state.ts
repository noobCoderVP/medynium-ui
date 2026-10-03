"use client";

import { useEffect, useState } from "react";
import { useUrlParams } from "@/lib/use-url-params";

export const PAGE_SIZES = [10, 25, 50, 100] as const;

export type SortOrder = "asc" | "desc";

export interface ListConfig {
  /** Names of the filter params this list owns, for example ["sex", "kind"]. Values are plain strings. */
  filters?: readonly string[];
  defaultSize?: number;
  defaultSort?: string;
  defaultOrder?: SortOrder;
}

/**
 * Search text, filters, sort and page of one list, all held in the URL (?q=&sex=&sort=&order=&offset=&size=), so a
 * filtered view is linkable and the back button works. Every value is sent to the API, which filters and sorts over
 * all rows before cutting the page; the browser never filters a partial page.
 *
 * Changing anything except the page returns to the first page. The search box is debounced, and it follows the
 * URL when something else (the top-bar search, a link) changes `q`.
 */
export function useListState(config: ListConfig = {}) {
  const { filters: filterNames = [], defaultSize = 10, defaultSort, defaultOrder = "asc" } = config;
  const { params, update } = useUrlParams();

  const q = params.get("q") ?? "";
  const size = Number(params.get("size")) || defaultSize;
  const offset = Math.max(0, Number(params.get("offset")) || 0);
  const sort = params.get("sort") ?? defaultSort ?? "";
  const order: SortOrder =
    params.get("order") === "asc" || params.get("order") === "desc"
      ? (params.get("order") as SortOrder)
      : defaultOrder;
  const filters: Record<string, string> = {};
  for (const name of filterNames) filters[name] = params.get(name) ?? "";

  // The text box can run ahead of the URL while the user types. `pushed` is the last value this box wrote, so a
  // different `q` in the URL is an outside change and the box follows it.
  const [text, setText] = useState(q);
  const [pushed, setPushed] = useState(q);
  const [seenQ, setSeenQ] = useState(q);
  if (q !== seenQ) {
    setSeenQ(q);
    if (q !== pushed) {
      setText(q);
      setPushed(q);
    }
  }

  useEffect(() => {
    const next = text.trim();
    if (next === q) return;
    const timer = setTimeout(() => {
      setPushed(next);
      update({ q: next || null, offset: null });
    }, 300);
    return () => clearTimeout(timer);
  }, [text, q, update]);

  const activeCount = (q ? 1 : 0) + filterNames.filter((name) => filters[name] !== "").length;

  return {
    q,
    text,
    setText,
    offset,
    limit: size,
    sort,
    order,
    filters,
    activeCount,
    setFilter: (name: string, value: string) => update({ [name]: value || null, offset: null }),
    setOffset: (value: number) => update({ offset: value > 0 ? String(value) : null }),
    setLimit: (value: number) =>
      update({ size: value === defaultSize ? null : String(value), offset: null }),
    setSort: (key: string, next: SortOrder) =>
      update({
        sort: key === defaultSort ? null : key,
        order: key === defaultSort && next === defaultOrder ? null : next,
        offset: null,
      }),
    /** Clicking a column: a new column starts ascending, the same column flips. */
    toggleSort: (key: string) => {
      const nextOrder: SortOrder = sort === key && order === "asc" ? "desc" : "asc";
      update({
        sort: key === defaultSort ? null : key,
        order: key === defaultSort && nextOrder === defaultOrder ? null : nextOrder,
        offset: null,
      });
    },
    clear: () => {
      setText("");
      setPushed("");
      update({ q: null, offset: null, ...Object.fromEntries(filterNames.map((n) => [n, null])) });
    },
    /** The query-string values for the API call. */
    apiParams: {
      q: q || undefined,
      limit: size,
      offset,
      sort: sort || undefined,
      order: sort ? order : undefined,
      ...Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, v || undefined])),
    } as Record<string, string | number | undefined>,
  };
}

export type ListState = ReturnType<typeof useListState>;
