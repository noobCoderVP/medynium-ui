"use client";

import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { NotFoundState } from "@/components/shared/state-panels";
import { Dialog } from "@/components/ui/dialog";
import { useUrlParams } from "@/lib/use-url-params";
import { useEvidence } from "../hooks/use-evidence";
import { REF, STMT, WHY } from "../lib/evidence-link";
import { EvidenceBody } from "./evidence-body";

/**
 * The Why? drawer. Open state is the URL (?why=ANS-0001&stmt=C1&ref=P2), so it opens from anywhere, survives a
 * refresh and is easy to test. A full-screen sheet on phones, a side drawer elsewhere.
 * Someone else's answer or a missing one is the same not-found state.
 */
export function EvidenceDrawer() {
  const { params, update } = useUrlParams();
  const answerId = params.get(WHY);
  const query = useEvidence(answerId);

  return (
    <Dialog
      open={Boolean(answerId)}
      onOpenChange={(open) => {
        if (!open) update({ [WHY]: null, [STMT]: null, [REF]: null });
      }}
      title="Why? The evidence behind this answer"
      description="Every statement links to the patient records, SQL and sources below."
      placement="right"
    >
      {answerId ? (
        <DataState
          query={query}
          skeleton={
            <div className="p-4">
              <SkeletonRows rows={4} />
            </div>
          }
          notFound={
            <div className="p-4">
              <NotFoundState
                title="We couldn't find that answer."
                body="It may belong to another user or no longer exist."
              />
            </div>
          }
        >
          {(data) => (
            <EvidenceBody data={data} statementId={params.get(STMT)} refId={params.get(REF)} />
          )}
        </DataState>
      ) : null}
    </Dialog>
  );
}
