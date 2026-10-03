"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";
import { DateField, ListToolbar } from "@/components/shared/list-toolbar";
import { Button } from "@/components/ui/button";
import type { ListState } from "@/lib/use-list-state";
import { cn } from "@/lib/utils";
import { EVENT_LABELS, EVENT_TYPES, type EventType } from "../lib/event-types";

interface Props {
  list: ListState;
  selectedTypes: string[];
  onTypes: (types: string[]) => void;
}

/**
 * Search and order are always visible; the date range and event types sit behind a Filters button so the row stays
 * scannable. The panel opens by itself when a filter is already applied. Every control is a labelled native
 * input and the state is in the URL.
 */
export function TimelineFilters({ list, selectedTypes, onTypes }: Props) {
  const panelId = useId();
  const { from, to } = list.filters;
  const filterCount = (from ? 1 : 0) + (to ? 1 : 0) + selectedTypes.length;
  const [opened, setOpened] = useState(filterCount > 0);
  const toggle = (type: EventType, on: boolean) =>
    onTypes(on ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type));
  return (
    <div className="space-y-3">
      <ListToolbar
        search={{ value: list.text, onChange: list.setText, label: "Search events" }}
        sort={{
          always: true,
          options: [{ key: "date", label: "Date" }],
          value: list.sort,
          order: list.order,
          onChange: list.setSort,
        }}
        activeCount={list.activeCount}
        onClear={list.clear}
      >
        <Button
          variant="outline"
          size="lg"
          aria-expanded={opened}
          aria-controls={panelId}
          onClick={() => setOpened((value) => !value)}
          className="max-sm:w-full"
        >
          <SlidersHorizontal aria-hidden="true" />
          Filters{filterCount > 0 ? ` (${filterCount})` : ""}
          <ChevronDown
            aria-hidden="true"
            className={cn("transition-transform", opened && "rotate-180")}
          />
        </Button>
      </ListToolbar>
      <div
        id={panelId}
        hidden={!opened}
        className="flex flex-wrap items-end gap-x-6 gap-y-3 rounded-xl border border-border bg-muted/60 p-3"
      >
        <DateField
          label="From"
          value={from}
          max={to || undefined}
          onChange={(v) => list.setFilter("from", v)}
        />
        <DateField
          label="To"
          value={to}
          min={from || undefined}
          onChange={(v) => list.setFilter("to", v)}
        />
        <fieldset className="w-full">
          <legend className="mb-1 text-xs font-medium text-muted-foreground">Event types</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {EVENT_TYPES.map((type) => (
              <label key={type} className="flex min-h-8 items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={selectedTypes.includes(type)}
                  onChange={(e) => toggle(type, e.target.checked)}
                />
                {EVENT_LABELS[type]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
