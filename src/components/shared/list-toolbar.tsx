"use client";

import { Search, X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { SortOrder } from "@/lib/use-list-state";
import { cn } from "@/lib/utils";

export interface SortOption {
  key: string;
  label: string;
}

interface Props {
  search?: {
    value: string;
    onChange: (value: string) => void;
    /** Accessible name and placeholder, for example "Name, id or condition". */
    label: string;
  };
  /** The sortable columns. Shown as a menu on phones, where the table header is not visible. */
  sort?: {
    /** True when the list has no table header to sort by (a note list, a timeline): the menu shows everywhere. */
    always?: boolean;
    options: SortOption[];
    value: string;
    order: SortOrder;
    onChange: (key: string, order: SortOrder) => void;
  };
  activeCount?: number;
  onClear?: () => void;
  /** Filter controls, usually `FilterField`s. */
  children?: ReactNode;
}

/** A labelled select for one filter. The label is visible so the control is never guessed at. */
export function FilterField({
  label,
  value,
  onChange,
  options,
  anyLabel = "Any",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  anyLabel?: string;
}) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1 max-sm:flex-1 max-sm:basis-[calc(50%-0.375rem)]">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sm:min-w-36"
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

/** A labelled date input for a range filter. Native, so phones show their own picker. */
export function DateField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1 max-sm:flex-1 max-sm:basis-[calc(50%-0.375rem)]">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="sm:w-40"
      />
    </div>
  );
}

/**
 * The control row above a list: search, filters and a sort menu for phones. It only edits list state; the API does
 * the filtering over every row. On a phone the controls stack and fill the width.
 */
export function ListToolbar({ search, sort, activeCount = 0, onClear, children }: Props) {
  const searchId = useId();
  const sortId = useId();
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-muted/60 p-3">
      {search ? (
        <div className="relative w-full sm:max-w-xs sm:flex-1">
          <label htmlFor={searchId} className="sr-only">
            {search.label}
          </label>
          <Search
            className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id={searchId}
            type="search"
            className="pl-8"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.label}
            autoComplete="off"
          />
        </div>
      ) : null}
      {children}
      {sort ? (
        <div
          className={cn("flex min-w-0 flex-col gap-1 max-sm:w-full", !sort.always && "md:hidden")}
        >
          <label htmlFor={sortId} className="text-xs font-medium text-muted-foreground">
            Sort by
          </label>
          <Select
            id={sortId}
            value={`${sort.value}:${sort.order}`}
            onChange={(e) => {
              const [key, order] = e.target.value.split(":");
              sort.onChange(key, order as SortOrder);
            }}
          >
            {sort.options.flatMap((option) => [
              <option key={`${option.key}:asc`} value={`${option.key}:asc`}>
                {option.label}, ascending
              </option>,
              <option key={`${option.key}:desc`} value={`${option.key}:desc`}>
                {option.label}, descending
              </option>,
            ])}
          </Select>
        </div>
      ) : null}
      {activeCount > 0 && onClear ? (
        <Button variant="ghost" size="lg" onClick={onClear} className="max-sm:w-full">
          <X aria-hidden="true" />
          Clear {activeCount === 1 ? "filter" : `${activeCount} filters`}
        </Button>
      ) : null}
    </div>
  );
}
