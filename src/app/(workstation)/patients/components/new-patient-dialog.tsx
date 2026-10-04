"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreatePatient } from "../hooks/use-create-patient";

const EMPTY: Record<"full_name" | "birth_date" | "city" | "state" | "phone", string> & {
  sex: "M" | "F";
} = { full_name: "", birth_date: "", sex: "F", city: "", state: "", phone: "" };

/**
 * Register a new patient (doctors). The server checks the fields, warns about a possible duplicate (same name and
 * birth date) and assigns the patient to the signed-in doctor. Synthetic data only: do not enter real people.
 */
export function NewPatientDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const save = useCreatePatient();
  const ids = {
    name: useId(),
    dob: useId(),
    sex: useId(),
    city: useId(),
    state: useId(),
    phone: useId(),
  };
  const set = (field: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    save.create({
      full_name: form.full_name.trim(),
      birth_date: form.birth_date,
      sex: form.sex,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      phone: form.phone.trim() || null,
      confirm_duplicate: confirmDuplicate,
    });
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <UserPlus aria-hidden="true" />
        New patient
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            save.reset();
            setConfirmDuplicate(false);
            setForm(EMPTY);
          }
        }}
        title="New patient"
        description="Synthetic data only. The patient is assigned to you."
      >
        {save.created ? (
          <div role="status" className="space-y-3 p-4 text-sm">
            <p className="font-medium text-ok">Registered {save.created.patient_id}.</p>
            <p className="text-muted-foreground">
              The record opens now; summaries and similar-patient search catch up within seconds.
            </p>
            <Link
              href={`/patients/${save.created.patient_id}`}
              className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              Open the record
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 p-4">
            {save.message ? (
              <div
                role="alert"
                className="space-y-2 rounded-md border border-crit/40 bg-crit-soft px-3 py-2 text-sm text-crit"
              >
                <p>{save.message}</p>
                {save.duplicate ? (
                  <label className="flex items-center gap-2 text-foreground">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={confirmDuplicate}
                      onChange={(e) => setConfirmDuplicate(e.target.checked)}
                    />
                    This is a different person; register anyway
                  </label>
                ) : null}
              </div>
            ) : null}
            <Field id={ids.name} label="Full name">
              <Input
                id={ids.name}
                required
                maxLength={120}
                value={form.full_name}
                onChange={set("full_name")}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id={ids.dob} label="Date of birth">
                <Input
                  id={ids.dob}
                  type="date"
                  required
                  value={form.birth_date}
                  onChange={set("birth_date")}
                />
              </Field>
              <Field id={ids.sex} label="Sex">
                <select
                  id={ids.sex}
                  value={form.sex}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sex: e.target.value === "M" ? "M" : "F" }))
                  }
                  className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                >
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </select>
              </Field>
              <Field id={ids.city} label="City (optional)">
                <Input id={ids.city} maxLength={120} value={form.city} onChange={set("city")} />
              </Field>
              <Field id={ids.state} label="State (optional)">
                <Input id={ids.state} maxLength={120} value={form.state} onChange={set("state")} />
              </Field>
            </div>
            <Field id={ids.phone} label="Phone (optional)">
              <Input id={ids.phone} inputMode="tel" value={form.phone} onChange={set("phone")} />
            </Field>
            <Button
              type="submit"
              disabled={save.pending || !form.full_name.trim() || !form.birth_date}
              className="max-sm:h-10 max-sm:w-full"
            >
              {save.pending ? "Saving…" : "Register patient"}
            </Button>
          </form>
        )}
      </Dialog>
    </>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
