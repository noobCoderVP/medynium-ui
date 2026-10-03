"use client";

import { DateField, ListToolbar } from "@/components/shared/list-toolbar";
import type { ListState } from "@/lib/use-list-state";
import { EVENT_LABELS, EVENT_TYPES, type EventType } from "../lib/event-types";

interface Props {
  list: ListState;
  selectedTypes: string[];
  onTypes: (types: string[]) => void;
}

/** Text, date range, order and event types. Every control is a labelled native input; the state is in the URL. */
export function TimelineFilters({ list, selectedTypes, onTypes }: Props) {
  const toggle = (type: EventType, on: boolean) =>
    onTypes(on ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type));
  const { from, to } = list.filters;
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
      </ListToolbar>
    </div>
  );
}
