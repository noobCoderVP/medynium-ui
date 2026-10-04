"use client";

import { Search, X } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { SortOrder } from "@/lib/use-list-state";
import { LAB_SORTS } from "./labs-table";

const QUICK = [
  { value: "", label: "All" },
  { value: "abnormal", label: "Abnormal" },
  { value: "HIGH", label: "High" },
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
];

interface Props {
  text: string;
  onText: (value: string) => void;
  flag: string;
  onFlag: (value: string) => void;
  sort: string;
  order: SortOrder;
  onSort: (key: string, order: SortOrder) => void;
  activeCount: number;
  onClear: () => void;
}

/** One compact row: search, a status dropdown and, on phones, a sort menu. */
export function LabsToolbar(props: Props) {
  const searchId = useId();
  const sortId = useId();
  const statusId = useId();
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-2 p-2">
      <div className="relative w-full sm:max-w-xs sm:flex-1">
        <label htmlFor={searchId} className="sr-only">
          Search tests
        </label>
        <Search
          className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={searchId}
          type="search"
          className="pl-8"
          value={props.text}
          onChange={(e) => props.onText(e.target.value)}
          placeholder="Search tests"
          autoComplete="off"
        />
      </div>
      <div className="max-sm:w-full">
        <label htmlFor={statusId} className="sr-only">
          Status
        </label>
        <Select
          id={statusId}
          value={props.flag}
          onValueChange={props.onFlag}
          options={QUICK.map((o) => (o.value ? o : { value: "", label: "All results" }))}
        />
      </div>
      <div className="max-sm:w-full md:hidden">
        <label htmlFor={sortId} className="sr-only">
          Sort by
        </label>
        <Select
          id={sortId}
          value={`${props.sort}:${props.order}`}
          onValueChange={(v) => {
            const [key, order] = v.split(":");
            props.onSort(key, order as SortOrder);
          }}
          options={LAB_SORTS.flatMap((o) => [
            { value: `${o.key}:asc`, label: `Sort: ${o.label}, ascending` },
            { value: `${o.key}:desc`, label: `Sort: ${o.label}, descending` },
          ])}
        />
      </div>
      {props.activeCount > 0 ? (
        <Button variant="ghost" onClick={props.onClear} className="max-sm:w-full">
          <X aria-hidden="true" />
          Reset
        </Button>
      ) : null}
    </div>
  );
}
