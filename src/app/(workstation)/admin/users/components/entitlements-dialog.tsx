"use client";

import { useState } from "react";
import { DataState, SkeletonRows } from "@/components/shared/data-state";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { UserItem } from "@/lib/api/types";
import { CHOICES_PAGE, useEntitlementEditor } from "../hooks/use-entitlements";

function Editor({ user, onDone }: { user: UserItem; onDone: () => void }) {
  const [search, setSearch] = useState("");
  const [chosen, setChosen] = useState<Set<string> | null>(null);
  const [offset, setOffset] = useState(0);
  const { current, choices, save } = useEntitlementEditor(user.user_id, search.trim(), offset);
  // Until the user edits, the selection is what the server says they can see now.
  const selected = chosen ?? new Set(current.data?.patient_ids ?? []);

  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    setChosen(next);
  };

  return (
    <div className="space-y-3 p-4">
      <div className="space-y-1">
        <label htmlFor="ent-search" className="text-sm font-medium">
          Find patients
        </label>
        <Input
          id="ent-search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          placeholder="Name, id or condition"
          autoComplete="off"
        />
      </div>
      <DataState query={current} skeleton={<SkeletonRows rows={3} />}>
        {() => (
          <DataState
            query={choices}
            skeleton={<SkeletonRows rows={5} />}
            isEmpty={(p) => p.items.length === 0}
            empty={<p className="text-sm text-muted-foreground">No patients match.</p>}
          >
            {(page) => (
              <fieldset className="space-y-2">
                <legend className="text-sm text-muted-foreground" aria-live="polite">
                  {selected.size} selected in total
                </legend>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      setChosen(new Set([...selected, ...page.items.map((p) => p.patient_id)]))
                    }
                  >
                    Select this page
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      setChosen(
                        new Set(
                          [...selected].filter(
                            (id) => !page.items.some((p) => p.patient_id === id),
                          ),
                        ),
                      )
                    }
                  >
                    Clear this page
                  </Button>
                </div>
                <ul className="max-h-72 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                  {page.items.map((p) => (
                    <li key={p.patient_id}>
                      <label className="flex min-h-10 items-center gap-3 px-3 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 accent-primary"
                          checked={selected.has(p.patient_id)}
                          onChange={(e) => toggle(p.patient_id, e.target.checked)}
                        />
                        <span className="font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.age}, {p.sex} · <span className="font-mono">{p.patient_id}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <Pagination
                  noun="patients"
                  total={page.total}
                  offset={offset}
                  limit={CHOICES_PAGE}
                  onOffsetChange={setOffset}
                />
              </fieldset>
            )}
          </DataState>
        )}
      </DataState>
      {save.isError ? (
        <p role="alert" className="text-sm text-crit">
          That didn&apos;t save. Try again.
        </p>
      ) : null}
      {save.isSuccess ? (
        <p role="status" className="text-sm text-ok">
          Saved. {save.data.total} patients assigned.
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button
          loading={save.isPending}
          disabled={chosen === null}
          onClick={() => save.mutate([...selected])}
        >
          Save access
        </Button>
        <Button variant="outline" onClick={onDone}>
          Close
        </Button>
      </div>
    </div>
  );
}

/** Who can see which patients. Saving replaces the user's whole list, so the count is shown before you commit. */
export function EntitlementsDialog({
  user,
  onClose,
}: {
  user: UserItem | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={user !== null}
      onOpenChange={(open) => !open && onClose()}
      title={user ? `Access for ${user.display_name}` : "Access"}
      description="Choose the patients this user can see. The server enforces this on every request."
      placement="right"
    >
      {user ? <Editor key={user.user_id} user={user} onDone={onClose} /> : null}
    </Dialog>
  );
}
