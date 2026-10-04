"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { OtpChallenge } from "@/lib/api/types";

interface Props {
  challenge: OtpChallenge;
  pending: boolean;
  message: string | null;
  onVerify: (code: string) => void;
  onCancel: () => void;
}

/** The second sign-in step: the six digits emailed after the password was accepted. */
export function OtpForm({ challenge, pending, message, onVerify, onCancel }: Props) {
  const [code, setCode] = useState("");
  const id = useId();
  const valid = /^[0-9]{6}$/.test(code);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (valid) onVerify(code);
  }

  return (
    <Card>
      <CardBody className="pt-4">
        <h1 className="text-lg font-semibold">Check your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a six-digit code to <span className="font-medium">{challenge.email_hint}</span>.
          It expires in {challenge.expires_in_minutes} minutes.
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
          <div className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-medium">
              Sign-in code
            </label>
            <Input
              id={id}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="h-11 text-center font-heading text-xl tracking-[0.5em]"
              autoFocus
            />
          </div>
          <Button type="submit" size="lg" className="w-full" loading={pending} disabled={!valid}>
            {pending ? "Checking…" : "Verify and sign in"}
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={onCancel}>
            Use a different account
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
