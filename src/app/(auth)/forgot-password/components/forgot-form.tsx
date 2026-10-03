"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import { useForgotPassword } from "../hooks/use-forgot";

/** Ask for a reset link. The answer is the same whether or not the address has an account. */
export function ForgotForm() {
  const { request, pending, sent, message } = useForgotPassword();
  const [email, setEmail] = useState("");
  const id = useId();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (email.trim()) request(email.trim());
  }

  return (
    <Card>
      <CardBody className="pt-4">
        <h1 className="text-lg font-semibold">Reset your password</h1>
        {sent ? (
          <div role="status" className="mt-3 space-y-3 text-sm">
            <p>{copy.auth.forgotSent}</p>
            <Link href="/sign-in" className="inline-block font-medium text-primary underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the email you sign in with and we will send you a one-time link.
            </p>
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
                Email
              </label>
              <Input
                id={id}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={pending || !email.trim()}>
              {pending ? "Sending…" : "Send reset link"}
            </Button>
            <p className="text-center text-sm">
              <Link href="/sign-in" className="font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </CardBody>
    </Card>
  );
}
