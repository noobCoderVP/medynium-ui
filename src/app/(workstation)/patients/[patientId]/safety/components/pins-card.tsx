"use client";

import { Pin, Trash2 } from "lucide-react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { RefButton } from "@/features/evidence";
import { copy } from "@/lib/copy";
import { formatDateTime } from "@/lib/format";
import { usePinList } from "../hooks/use-pin-list";

/** Evidence the doctor chose to keep. Each pin reopens its answer's evidence at that item. */
export function PinsCard({ patientId }: { patientId: string }) {
  const { query, remove } = usePinList(patientId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pinned evidence{query.data ? ` · ${query.data.items.length}` : ""}</CardTitle>
      </CardHeader>
      <CardBody>
        <DataState
          query={query}
          skeleton={<SkeletonRows rows={2} />}
          isEmpty={(list) => list.items.length === 0}
          empty={
            <EmptyState icon={<Pin className="size-6" />} title="No pinned evidence">
              {copy.empty.pins}
            </EmptyState>
          }
        >
          {(list) => (
            <ul className="space-y-2">
              {list.items.map((pin) => (
                <li
                  key={pin.pin_id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-2 p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">{pin.label ?? pin.evidence_id}</p>
                    {pin.note ? <p className="text-muted-foreground">{pin.note}</p> : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Pinned {formatDateTime(pin.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <RefButton answerId={pin.answer_id} evidenceId={pin.evidence_id}>
                      {pin.evidence_id}
                    </RefButton>
                    <Tooltip label="Remove pin">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove pin ${pin.evidence_id}`}
                        onClick={() => remove.mutate(pin.pin_id)}
                        disabled={remove.isPending}
                      >
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DataState>
      </CardBody>
    </Card>
  );
}
