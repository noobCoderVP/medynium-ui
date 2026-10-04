"use client";

import { Plus } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddMedication } from "../hooks/use-add-medication";

const EMPTY = { description: "", strength_text: "", dose_text: "", start_date: "" };

/** Add a medicine to this patient's list. The server matches the name to a known drug (brand names included). */
export function AddMedicationDialog({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const save = useAddMedication(patientId);
  const ids = { name: useId(), strength: useId(), dose: useId(), start: useId() };
  const set = (field: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    save.add({
      description: form.description.trim(),
      strength_text: form.strength_text.trim() || null,
      dose_text: form.dose_text.trim() || null,
      start_date: form.start_date || null,
    });
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus aria-hidden="true" />
        Add medicine
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            save.reset();
            setForm(EMPTY);
          }
        }}
        title="Add a medicine"
        description="Brand or generic name. Synthetic data only."
      >
        {save.saved ? (
          <div role="status" className="space-y-3 p-4 text-sm">
            <p className="font-medium text-ok">Added to the record.</p>
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 p-4">
            {save.message ? (
              <p
                role="alert"
                className="rounded-md border border-crit/40 bg-crit-soft px-3 py-2 text-sm text-crit"
              >
                {save.message}
              </p>
            ) : null}
            <div className="space-y-1">
              <label htmlFor={ids.name} className="text-sm font-medium">
                Medicine
              </label>
              <Input
                id={ids.name}
                required
                maxLength={200}
                placeholder="for example Glycomet 500"
                value={form.description}
                onChange={set("description")}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor={ids.strength} className="text-sm font-medium">
                  Strength (optional)
                </label>
                <Input
                  id={ids.strength}
                  value={form.strength_text}
                  onChange={set("strength_text")}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={ids.dose} className="text-sm font-medium">
                  Dose (optional)
                </label>
                <Input id={ids.dose} value={form.dose_text} onChange={set("dose_text")} />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor={ids.start} className="text-sm font-medium">
                Start date (optional)
              </label>
              <Input
                id={ids.start}
                type="date"
                value={form.start_date}
                onChange={set("start_date")}
              />
            </div>
            <Button
              type="submit"
              disabled={save.pending || !form.description.trim()}
              className="max-sm:h-10 max-sm:w-full"
            >
              {save.pending ? "Saving…" : "Add medicine"}
            </Button>
          </form>
        )}
      </Dialog>
    </>
  );
}
