import { Pill } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DrugEntry } from "@/lib/api/types";

interface Props {
  drugs: DrugEntry[];
  selected: string;
  onSelect: (name: string) => void;
}

/** Every indexed drug with its Indian brands. Choosing one lists that drug's label sections. */
export function DrugRail({ drugs, selected, onSelect }: Props) {
  const [filter, setFilter] = useState("");
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    // Bring the chosen drug into view when it arrives from a link or the narrow-screen select.
    list.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: "nearest" });
  }, [selected]);
  const needle = filter.trim().toLowerCase();
  const shown = needle
    ? drugs.filter(
        (d) => d.name.toLowerCase().includes(needle) || d.brands.some((b) => b.includes(needle)),
      )
    : drugs;
  return (
    <nav
      aria-label="Indexed drugs"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div className="shrink-0 space-y-2 border-b border-border p-3">
        <h2 className="text-sm font-semibold">Drugs ({drugs.length})</h2>
        <label htmlFor="kfilter" className="sr-only">
          Filter drugs
        </label>
        <Input
          id="kfilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name or brand"
          autoComplete="off"
        />
      </div>
      <ul ref={list} className="min-h-40 flex-1 overflow-y-auto p-1.5">
        {shown.length === 0 ? (
          <li className="px-2 py-3 text-sm text-muted-foreground">No indexed drug matches.</li>
        ) : null}
        {shown.map((d) => {
          const on = d.name === selected;
          return (
            <li key={d.drug_id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onSelect(on ? "" : d.name)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                  on && "bg-primary/10 font-medium text-primary hover:bg-primary/15",
                )}
              >
                <Pill className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate">{d.name}</span>
                  {d.brands.length > 0 ? (
                    <span className="block truncate text-xs font-normal text-muted-foreground capitalize">
                      {d.brands.slice(0, 3).join(", ")}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
