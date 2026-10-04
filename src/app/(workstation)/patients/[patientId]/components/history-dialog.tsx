"use client";

import { History } from "lucide-react";
import { useState } from "react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/format";
import { useHistory } from "../hooks/use-history";

const OP: Record<string, string> = {
  CREATE: "Created",
  UPDATE: "Updated",
  ARCHIVE: "Archived",
  RESTORE: "Restored",
};

/** The audit trail: every change to this patient's record, written by the database, never by the client. */
export function HistoryDialog({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false);
  const query = useHistory(patientId, open);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <History aria-hidden="true" />
        History
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        placement="right"
        title="Record history"
        description="Who changed what on this patient, newest first."
      >
        <div className="p-4">
          <DataState
            query={query}
            skeleton={<SkeletonRows />}
            isEmpty={(d) => d.items.length === 0}
            empty={<EmptyState title="No changes recorded" />}
          >
            {(data) => (
              <ol className="divide-y divide-border text-sm">
                {data.items.map((entry, i) => (
                  <li key={`${entry.at}-${entry.record_id}-${i}`} className="space-y-0.5 py-2.5">
                    <p className="font-medium">
                      {OP[entry.op] ?? entry.op} {entry.entity.toLowerCase()}{" "}
                      <span className="font-mono text-xs text-muted-foreground">
                        {entry.record_id}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(entry.at)} · {entry.actor_name ?? "System"}
                    </p>
                    {entry.changed.length > 0 ? (
                      <p className="text-xs">Fields: {entry.changed.join(", ")}</p>
                    ) : null}
                    {entry.reason ? <p className="text-xs">Reason: {entry.reason}</p> : null}
                  </li>
                ))}
              </ol>
            )}
          </DataState>
        </div>
      </Dialog>
    </>
  );
}
