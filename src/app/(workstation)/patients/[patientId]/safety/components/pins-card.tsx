"use client";

import { Trash2 } from "lucide-react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
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
        <CardTitle>Pinned evidence</CardTitle>
      </CardHeader>
      <CardBody>
        <DataState
          query={query}
          skeleton={<SkeletonRows rows={2} />}
          isEmpty={(list) => list.items.length === 0}
          empty={<p className="text-sm text-muted-foreground">{copy.empty.pins}</p>}
        >
          {(list) => (
            <ul className="divide-y divide-border">
              {list.items.map((pin) => (
                <li
                  key={pin.pin_id}
                  className="flex items-center justify-between gap-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{pin.label ?? pin.evidence_id}</p>
                    <p className="text-xs text-muted-foreground">
                      Pinned {formatDateTime(pin.created_at)}
                      {pin.note ? ` · ${pin.note}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <RefButton answerId={pin.answer_id} evidenceId={pin.evidence_id}>
                      {pin.evidence_id}
                    </RefButton>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove pin ${pin.evidence_id}`}
                      onClick={() => remove.mutate(pin.pin_id)}
                      disabled={remove.isPending}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
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
