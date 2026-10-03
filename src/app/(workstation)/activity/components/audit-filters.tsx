"use client";

import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ACTIONS, OUTCOMES, humanize } from "../lib/labels";

interface Props {
  filters: { action: string; outcome: string; from: string; to: string };
  onChange: (key: "action" | "outcome" | "from" | "to", value: string) => void;
  onClear: () => void;
}

export function AuditFilters({ filters, onChange, onClear }: Props) {
  const active = Object.values(filters).some(Boolean);
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-3">
      <div className="space-y-1">
        <label htmlFor="a-action" className="text-xs font-medium text-muted-foreground">
          Action
        </label>
        <Select
          id="a-action"
          className="w-48"
          value={filters.action}
          onChange={(e) => onChange("action", e.target.value)}
        >
          <option value="">Any action</option>
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {humanize(a)}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <label htmlFor="a-outcome" className="text-xs font-medium text-muted-foreground">
          Outcome
        </label>
        <Select
          id="a-outcome"
          className="w-44"
          value={filters.outcome}
          onChange={(e) => onChange("outcome", e.target.value)}
        >
          <option value="">Any outcome</option>
          {OUTCOMES.map((o) => (
            <option key={o} value={o}>
              {humanize(o)}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <label htmlFor="a-from" className="text-xs font-medium text-muted-foreground">
          From
        </label>
        <Input
          id="a-from"
          type="date"
          className="w-40"
          value={filters.from}
          onChange={(e) => onChange("from", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="a-to" className="text-xs font-medium text-muted-foreground">
          To
        </label>
        <Input
          id="a-to"
          type="date"
          className="w-40"
          value={filters.to}
          onChange={(e) => onChange("to", e.target.value)}
        />
      </div>
      {active ? (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
