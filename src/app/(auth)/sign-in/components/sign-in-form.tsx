"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { useResumeSession, useSignIn } from "../hooks/use-sign-in";
import { OtpForm } from "./otp-form";

export function SignInForm({ next }: { next: string }) {
  const resuming = useResumeSession(next);
  const { signIn, verify, challenge, cancel, pending, message } = useSignIn(next);
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ids = { email: useId(), password: useId(), error: useId() };

  const missing = {
    email: touched && email.trim() === "",
    password: touched && password === "",
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (email.trim() && password) signIn({ email: email.trim(), password });
  }

  if (resuming) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Checking for an existing session…
      </p>
    );
  }

  if (challenge) {
    return (
      <OtpForm
        challenge={challenge}
        pending={pending}
        message={message}
        onVerify={verify}
        onCancel={cancel}
      />
    );
  }

  return (
    <Card>
      <CardBody className="pt-4">
        <h1 className="text-lg font-semibold">Sign in</h1>
        <form
          onSubmit={submit}
          noValidate
          className="mt-4 space-y-4"
          aria-describedby={message ? ids.error : undefined}
        >
          {message ? (
            <p
              id={ids.error}
              role="alert"
              className="rounded-md border border-crit/40 bg-crit-soft px-3 py-2 text-sm text-crit"
            >
              {message}
            </p>
          ) : null}
          <div className="space-y-1.5">
            <label htmlFor={ids.email} className="text-sm font-medium">
              Email
            </label>
            <Input
              id={ids.email}
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={missing.email}
              aria-describedby={missing.email ? `${ids.email}-err` : undefined}
            />
            {missing.email ? (
              <p id={`${ids.email}-err`} className="text-sm text-crit">
                Enter your email.
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <label htmlFor={ids.password} className="text-sm font-medium">
              Password
            </label>
            <Input
              id={ids.password}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={missing.password}
              aria-describedby={missing.password ? `${ids.password}-err` : undefined}
            />
            {missing.password ? (
              <p id={`${ids.password}-err`} className="text-sm text-crit">
                Enter your password.
              </p>
            ) : null}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-sm">
            <Link href="/forgot-password" className="font-medium text-primary hover:underline">
              Forgot your password?
            </Link>
          </p>
        </form>
      </CardBody>
    </Card>
  );
}
