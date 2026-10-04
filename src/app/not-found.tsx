import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/shared/back-button";
import { buttonVariants } from "@/components/ui/button";
import { copy } from "@/lib/copy";

export const metadata: Metadata = { title: "Page not found" };

/** The 404 for any address that matches no page. It never says whether a record exists (SEC-05). */
export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-10 text-center"
    >
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-2xl bg-accent text-primary"
      >
        <Compass className="size-8" />
      </span>
      <div className="space-y-2">
        <p className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Error 404
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {copy.notFound.page.title}
        </h1>
        <p className="text-muted-foreground">{copy.notFound.page.body}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <BackButton />
        <Link href="/dashboard" className={buttonVariants()}>
          Go to dashboard
        </Link>
        <Link href="/patients" className={buttonVariants({ variant: "outline" })}>
          Find a patient
        </Link>
      </div>
    </main>
  );
}
