"use client";

import { useId, useState, type FormEvent } from "react";
import { CopyLink } from "@/components/shared/copy-link";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api/errors";
import { formatDateTime } from "@/lib/format";
import { useInvites } from "../hooks/use-invites";

export function InviteForm({ invites }: { invites: ReturnType<typeof useInvites> }) {
  const { create, doctors } = invites;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"DOCTOR" | "ASSISTANT">("ASSISTANT");
  const [admin, setAdmin] = useState(false);
  const [supervisor, setSupervisor] = useState("");
  const [touched, setTouched] = useState(false);
  const ids = { email: useId(), name: useId(), role: useId(), sup: useId() };

  const missing =
    touched && (!email.trim() || !name.trim() || (role === "ASSISTANT" && !supervisor));

  function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!email.trim() || !name.trim() || (role === "ASSISTANT" && !supervisor)) return;
    create.mutate(
      {
        email: email.trim(),
        display_name: name.trim(),
        role,
        is_admin: role === "DOCTOR" && admin,
        supervising_doctor_id: role === "ASSISTANT" ? supervisor : null,
      },
      {
        onSuccess: () => {
          setEmail("");
          setName("");
          setTouched(false);
        },
      },
    );
  }

  const error = create.error;
  const errorText =
    error instanceof ApiError && error.status === 409
      ? "That email already has a pending invite or an account."
      : error instanceof ApiError && error.status < 500
        ? error.message
        : error
          ? "We couldn't create the invite. Try again."
          : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite someone</CardTitle>
      </CardHeader>
      <CardBody>
        <form onSubmit={submit} noValidate className="grid gap-3 md:grid-cols-2">
          {errorText ? (
            <p role="alert" className="text-sm text-crit md:col-span-2">
              {errorText}
            </p>
          ) : null}
          {missing ? (
            <p role="alert" className="text-sm text-crit md:col-span-2">
              Fill in every field to continue.
            </p>
          ) : null}
          <div className="space-y-1">
            <label htmlFor={ids.name} className="text-sm font-medium">
              Name
            </label>
            <Input
              id={ids.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={touched && !name.trim()}
              maxLength={120}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor={ids.email} className="text-sm font-medium">
              Email
            </label>
            <Input
              id={ids.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={touched && !email.trim()}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor={ids.role} className="text-sm font-medium">
              Role
            </label>
            <Select
              id={ids.role}
              value={role}
              onValueChange={(v) => setRole(v as "DOCTOR" | "ASSISTANT")}
              options={[
                { value: "ASSISTANT", label: "Clinic assistant" },
                { value: "DOCTOR", label: "Doctor" },
              ]}
            />
          </div>
          {role === "ASSISTANT" ? (
            <div className="space-y-1">
              <label htmlFor={ids.sup} className="text-sm font-medium">
                Supervising doctor
              </label>
              <Combobox
                id={ids.sup}
                value={supervisor}
                onValueChange={setSupervisor}
                invalid={touched && !supervisor}
                placeholder="Search for a doctor"
                options={(doctors.data?.items ?? []).map((d) => ({
                  value: d.user_id,
                  label: d.display_name,
                }))}
              />
            </div>
          ) : (
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
              />
              Can administer users
            </label>
          )}
          <div className="md:col-span-2">
            <Button type="submit" loading={create.isPending}>
              {create.isPending ? "Creating…" : "Create invite"}
            </Button>
          </div>
        </form>
        {create.data ? (
          <div
            className="mt-4 space-y-2 rounded-lg border border-ok/40 bg-ok-soft p-3"
            role="status"
          >
            <p className="text-sm font-medium text-ok">
              {create.data.email_sent
                ? `Invite created and emailed to ${create.data.email}.`
                : `Invite created. Email is not configured, so share this link with ${create.data.email}.`}
            </p>
            <CopyLink label="Invite link" url={create.data.accept_url} />
            <p className="text-xs text-muted-foreground">
              Works once. Expires {formatDateTime(create.data.expires_at)}.
            </p>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
