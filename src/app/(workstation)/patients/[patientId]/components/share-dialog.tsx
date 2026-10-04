"use client";

import { Mail } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import type { ShareRequest } from "@/lib/api/types";
import { useSharePatient } from "../hooks/use-share";

type Section = NonNullable<ShareRequest["include"]>[number];

const SECTIONS: { id: Section; label: string }[] = [
  { id: "diagnoses", label: "Active diagnoses" },
  { id: "medications", label: "Current medications" },
  { id: "labs", label: "Abnormal lab results" },
  { id: "events", label: "Recent events" },
];

/**
 * Email one summary of this patient to one recipient (email is one of the channels for patient information).
 * The summary is built on the server from what the sender can already open, the send is audited, and nothing is
 * sent until the button is pressed.
 */
export function ShareDialog({
  patientId,
  patientName,
}: {
  patientId: string;
  patientName: string;
}) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [include, setInclude] = useState<Section[]>(["diagnoses", "medications", "labs"]);
  const { send, pending, sent, message, reset } = useSharePatient(patientId);
  const ids = { to: useId(), note: useId() };

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!to.trim()) return;
    send({ to: to.trim(), note: note.trim() || null, include });
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Mail aria-hidden="true" />
        Email summary
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) reset();
        }}
        title="Email a summary"
        description={`Send a short summary of ${patientName} to one person. Synthetic data only.`}
      >
        {sent ? (
          <div role="status" className="space-y-3 p-4 text-sm">
            <p className="font-medium text-ok">Sent to {to.trim()}.</p>
            <p className="text-muted-foreground">
              The send is recorded in your activity log. The email carries a link back here, which
              only works for people who are assigned this patient.
            </p>
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4 p-4">
            {message ? (
              <p
                role="alert"
                className="rounded-md border border-crit/40 bg-crit-soft px-3 py-2 text-sm text-crit"
              >
                {message}
              </p>
            ) : null}
            <div className="space-y-1">
              <label htmlFor={ids.to} className="text-sm font-medium">
                Send to
              </label>
              <Input
                id={ids.to}
                type="email"
                inputMode="email"
                autoComplete="off"
                placeholder="name@clinic.example"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <fieldset className="space-y-1">
              <legend className="text-sm font-medium">Include</legend>
              {SECTIONS.map((section) => (
                <label key={section.id} className="flex min-h-9 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={include.includes(section.id)}
                    onChange={(e) =>
                      setInclude((current) =>
                        e.target.checked
                          ? [...current, section.id]
                          : current.filter((id) => id !== section.id),
                      )
                    }
                  />
                  {section.label}
                </label>
              ))}
            </fieldset>
            <div className="space-y-1">
              <label htmlFor={ids.note} className="text-sm font-medium">
                Note (optional)
              </label>
              <Textarea
                id={ids.note}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={pending || !to.trim()}
              className="max-sm:h-10 max-sm:w-full"
            >
              {pending ? "Sending…" : "Send email"}
            </Button>
          </form>
        )}
      </Dialog>
    </>
  );
}
