"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input, Textarea } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import type { Finding, FindingUpdate } from "@/lib/api/types";
import { useColleagues } from "../hooks/use-findings";

type Mode = "FLAGGED" | "DISMISSED" | "ESCALATED";

const today = () => new Date().toISOString().slice(0, 10);

/**
 * The decision controls for one finding. Acknowledge is one click. Following up, dismissing and escalating each ask
 * for the one thing they need (a date, a reason, a colleague) before they can be sent, as the server requires.
 */
export function DecisionForm({
  patientId,
  finding,
  pending,
  error,
  onDecide,
}: {
  patientId: string;
  finding: Finding;
  pending: boolean;
  error: unknown;
  onDecide: (body: FindingUpdate) => void;
}) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [date, setDate] = useState(today());
  const [reason, setReason] = useState("");
  const [colleague, setColleague] = useState("");
  const ids = { date: useId(), reason: useId(), colleague: useId() };
  const colleagues = useColleagues(patientId, mode === "ESCALATED");
  const message = error instanceof ApiError ? error.message : error ? "That did not save." : null;

  const ready =
    (mode === "FLAGGED" && date) ||
    (mode === "DISMISSED" && reason.trim().length >= 3) ||
    (mode === "ESCALATED" && colleague);

  function send() {
    if (mode === "FLAGGED") onDecide({ status: "FLAGGED", follow_up_on: date });
    if (mode === "DISMISSED") onDecide({ status: "DISMISSED", reason: reason.trim() });
    if (mode === "ESCALATED") onDecide({ status: "ESCALATED", assigned_to: colleague });
    setMode(null);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {finding.status !== "ACKNOWLEDGED" ? (
          <Button size="sm" disabled={pending} onClick={() => onDecide({ status: "ACKNOWLEDGED" })}>
            Acknowledge
          </Button>
        ) : null}
        <Button size="sm" variant="outline" onClick={() => setMode("FLAGGED")}>
          Follow up…
        </Button>
        <Button size="sm" variant="outline" onClick={() => setMode("ESCALATED")}>
          Escalate…
        </Button>
        {finding.status !== "DISMISSED" ? (
          <Button size="sm" variant="outline" onClick={() => setMode("DISMISSED")}>
            Dismiss…
          </Button>
        ) : null}
        {finding.status !== "NEW" ? (
          <Button
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() => onDecide({ status: "NEW" })}
          >
            Reopen
          </Button>
        ) : null}
      </div>
      {mode === "FLAGGED" ? (
        <div className="space-y-1">
          <label htmlFor={ids.date} className="text-xs font-medium">
            Follow up on
          </label>
          <Input
            id={ids.date}
            type="date"
            min={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      ) : null}
      {mode === "DISMISSED" ? (
        <div className="space-y-1">
          <label htmlFor={ids.reason} className="text-xs font-medium">
            Reason (required)
          </label>
          <Textarea
            id={ids.reason}
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      ) : null}
      {mode === "ESCALATED" ? (
        <div className="space-y-1">
          <label htmlFor={ids.colleague} className="text-xs font-medium">
            Escalate to
          </label>
          <Combobox
            id={ids.colleague}
            value={colleague}
            onValueChange={setColleague}
            placeholder="Search for a colleague"
            options={(colleagues.data?.items ?? []).map((c) => ({
              value: c.user_id,
              label: `${c.name} (${c.role.toLowerCase()})`,
            }))}
          />
          {colleagues.data && colleagues.data.items.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No one else has this patient. Ask an administrator to assign a colleague.
            </p>
          ) : null}
        </div>
      ) : null}
      {mode ? (
        <div className="flex gap-2">
          <Button size="sm" loading={pending} disabled={!ready} onClick={send}>
            Save decision
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setMode(null)}>
            Cancel
          </Button>
        </div>
      ) : null}
      {message ? (
        <p role="alert" className="text-xs text-crit">
          {message}
        </p>
      ) : null}
    </div>
  );
}
