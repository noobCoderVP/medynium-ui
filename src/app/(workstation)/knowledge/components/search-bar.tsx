import { Search, X } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface Props {
  text: string;
  onText: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  drug: string;
  drugNames: string[];
  onDrug: (value: string) => void;
  section: string;
  sections: string[];
  onSection: (value: string) => void;
  canClear: boolean;
  onClear: () => void;
  busy: boolean;
}

/** The search box with its two filters. The drug list is in the rail on wide screens and here on narrow ones. */
export function SearchBar(p: Props) {
  return (
    <form
      onSubmit={p.onSubmit}
      role="search"
      aria-label="Search drug labels"
      className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="relative">
        <label htmlFor="kq" className="sr-only">
          Search drug labels
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="kq"
          type="search"
          className="h-11 pr-24 pl-9 text-base"
          value={p.text}
          onChange={(e) => p.onText(e.target.value)}
          placeholder="Search a drug, brand or topic"
          autoComplete="off"
        />
        <span
          className="absolute top-1/2 right-10 -translate-y-1/2 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {p.busy ? "Searching..." : ""}
        </span>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-44 flex-1 space-y-1 lg:hidden">
          <label htmlFor="kdrug" className="text-xs font-medium text-muted-foreground">
            Drug
          </label>
          <Combobox
            id="kdrug"
            value={p.drug}
            onValueChange={p.onDrug}
            placeholder="All drugs"
            options={p.drugNames.map((name) => ({ value: name, label: name }))}
          />
        </div>
        <div className="min-w-44 flex-1 space-y-1 sm:max-w-xs">
          <label htmlFor="ksec" className="text-xs font-medium text-muted-foreground">
            Section
          </label>
          <Select
            id="ksec"
            value={p.section}
            onValueChange={p.onSection}
            options={[
              { value: "", label: "All sections" },
              ...p.sections.map((name) => ({ value: name, label: name })),
            ]}
          />
        </div>
        <div className="ml-auto flex gap-2">
          {p.canClear ? (
            <Button type="button" variant="ghost" size="lg" onClick={p.onClear}>
              <X aria-hidden="true" /> Clear
            </Button>
          ) : null}
          <Button type="submit" size="lg">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
