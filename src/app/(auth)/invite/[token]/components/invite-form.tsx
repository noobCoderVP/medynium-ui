"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { ErrorState, NotFoundState } from "@/components/shared/state-panels";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { isNotFound } from "@/lib/api/errors";
import { copy } from "@/lib/copy";
import { formatDate } from "@/lib/format";
import { useAcceptInvite, useInvitePreview } from "../hooks/use-invite";

export function InviteForm({ token }: { token: string }) {
  const preview = useInvitePreview(token);
  const { accept, pending, done, message } = useAcceptInvite(token);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const ids = { name: useId(), password: useId(), confirm: useId() };

  if (preview.isPending) return <Skeleton className="h-64 w-full" />;
  if (preview.isError) {
    return isNotFound(preview.error) ? (
      <NotFoundState title={copy.auth.inviteInvalid} body="" />
    ) : (
      <ErrorState error={preview.error} onRetry={() => void preview.refetch()} />
    );
  }

  const invite = preview.data;
  const reset = invite.kind === "PASSWORD_RESET";
  const mismatch = touched && password !== confirm;
  const empty = touched && password === "";

  function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (password && password === confirm) {
      accept({ password, displayName: reset ? undefined : name.trim() || undefined });
    }
  }

  if (done) {
    return (
      <Card>
        <CardBody className="pt-4" role="status">
          <h1 className="text-lg font-semibold">{copy.auth.inviteDone}</h1>
          <Link
            href="/sign-in"
            className="mt-3 inline-block text-sm font-medium text-primary underline"
          >
            Go to sign in
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="pt-4">
        <h1 className="text-lg font-semibold">
          {reset ? "Set a new password" : "Accept your invitation"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {invite.email} · {invite.role === "DOCTOR" ? "Doctor" : "Clinic assistant"} · link valid
          until {formatDate(invite.expires_at)}
        </p>
        <form onSubmit={submit} noValidate className="mt-4 space-y-4">
          {message ? (
            <p
              role="alert"
              className="rounded-md border border-crit/40 bg-crit-soft px-3 py-2 text-sm text-crit"
            >
              {message}
            </p>
          ) : null}
          {reset ? null : (
            <div className="space-y-1.5">
              <label htmlFor={ids.name} className="text-sm font-medium">
                Your name
              </label>
              <Input
                id={ids.name}
                autoComplete="name"
                value={name}
                placeholder={invite.display_name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor={ids.password} className="text-sm font-medium">
              New password
            </label>
            <Input
              id={ids.password}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={empty}
              aria-describedby={empty ? `${ids.password}-err` : undefined}
            />
            {empty ? (
              <p id={`${ids.password}-err`} className="text-sm text-crit">
                Choose a password.
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <label htmlFor={ids.confirm} className="text-sm font-medium">
              Confirm password
            </label>
            <Input
              id={ids.confirm}
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={mismatch}
              aria-describedby={mismatch ? `${ids.confirm}-err` : undefined}
            />
            {mismatch ? (
              <p id={`${ids.confirm}-err`} className="text-sm text-crit">
                The two passwords don&apos;t match.
              </p>
            ) : null}
          </div>
          <Button type="submit" size="lg" className="w-full" loading={pending}>
            {pending ? "Saving…" : reset ? "Set password" : "Create my account"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
