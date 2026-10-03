"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/format";
import { useSavedViews } from "../hooks/use-saved-views";
import { contentFromParams, hrefFromContent } from "../lib/view-content";

/**
 * Saved views (U-15, P1). Saving is two steps and never silent: preview what will be stored, then approve it
 * (05 principle 6, FR-22). A preview writes nothing and expires after ten minutes.
 */
export function ViewsDialog({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const params = useSearchParams();
  const { list, preview, save } = useSavedViews(patientId);
  const pending = preview.data;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Bookmark aria-hidden="true" />
        Views
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) preview.reset();
        }}
        title="Saved views"
        description="Save the screen you are on to come back to it. Nothing is saved until you approve the preview."
      >
        <div className="space-y-4 p-4">
          {pending ? (
            <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-3 text-sm">
              <p className="font-medium">Preview: this will be saved</p>
              <dl className="space-y-1">
                <div>
                  <dt className="inline text-muted-foreground">Name: </dt>
                  <dd className="inline">{pending.title}</dd>
                </div>
                <div>
                  <dt className="inline text-muted-foreground">Screen: </dt>
                  <dd className="inline font-mono text-xs">
                    {hrefFromContent(patientId, pending.content)}
                  </dd>
                </div>
                <div>
                  <dt className="inline text-muted-foreground">Preview expires: </dt>
                  <dd className="inline">{formatDateTime(pending.expires_at)}</dd>
                </div>
              </dl>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={save.isPending}
                  onClick={() => save.mutate(pending.preview_id)}
                >
                  Approve and save
                </Button>
                <Button size="sm" variant="outline" onClick={() => preview.reset()}>
                  Cancel
                </Button>
              </div>
              {save.isError ? (
                <p role="alert" className="text-crit">
                  That didn&apos;t save. Preview again and retry.
                </p>
              ) : null}
            </div>
          ) : (
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                preview.mutate(contentFromParams(params, title.trim() || "Saved view"));
              }}
            >
              <div className="flex-1 space-y-1">
                <label htmlFor="view-title" className="text-sm font-medium">
                  Name for this view
                </label>
                <Input
                  id="view-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Saved view"
                  maxLength={120}
                />
              </div>
              <Button type="submit" disabled={preview.isPending}>
                Preview
              </Button>
            </form>
          )}
          {preview.isError ? (
            <p role="alert" className="text-sm text-crit">
              Couldn&apos;t prepare a preview. Try again.
            </p>
          ) : null}
          <section aria-labelledby="saved-heading" className="space-y-2">
            <h3 id="saved-heading" className="text-sm font-semibold">
              Your saved views
            </h3>
            <DataState
              query={list}
              skeleton={<SkeletonRows rows={2} />}
              isEmpty={(items) => items.length === 0}
              empty={
                <p className="text-sm text-muted-foreground">
                  No saved views for this patient yet.
                </p>
              }
            >
              {(items) => (
                <ul className="divide-y divide-border text-sm">
                  {items.map((view) => (
                    <li key={view.view_id} className="py-2">
                      <Link
                        href={hrefFromContent(patientId, view.content)}
                        onClick={() => setOpen(false)}
                        className="font-medium text-primary hover:underline"
                      >
                        {view.title ?? "Saved view"}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Saved {formatDateTime(view.approved_at ?? view.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </DataState>
          </section>
        </div>
      </Dialog>
    </>
  );
}
