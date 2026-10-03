"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EVENT_LABELS, EVENT_TYPES, type EventType } from "../lib/event-types";

interface Props {
  from: string;
  to: string;
  selectedTypes: string[];
  onRange: (range: { from?: string; to?: string }) => void;
  onTypes: (types: string[]) => void;
  onClear: () => void;
}

/** Date range and event types. Every control is a labelled native input; the state is in the URL. */
export function TimelineFilters({ from, to, selectedTypes, onRange, onTypes, onClear }: Props) {
  const toggle = (type: EventType, on: boolean) =>
    onTypes(on ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type));
  const active = Boolean(from || to || selectedTypes.length);
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label htmlFor="tl-from" className="text-xs font-medium text-muted-foreground">
            From
          </label>
          <Input
            id="tl-from"
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => onRange({ from: e.target.value })}
            className="w-40"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="tl-to" className="text-xs font-medium text-muted-foreground">
            To
          </label>
          <Input
            id="tl-to"
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => onRange({ to: e.target.value })}
            className="w-40"
          />
        </div>
        {active ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        ) : null}
      </div>
      <fieldset>
        <legend className="mb-1 text-xs font-medium text-muted-foreground">Event types</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {EVENT_TYPES.map((type) => (
            <label key={type} className="flex min-h-6 items-center gap-1.5 text-sm">
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
  );
}
