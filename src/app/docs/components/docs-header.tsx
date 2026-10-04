import { ArrowRight, HeartPulse } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { PrintButton } from "./print-button";

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur print:hidden">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 lg:px-8">
        <Link
          href="/docs"
          className="flex min-w-0 items-center gap-2.5 font-heading text-base font-bold tracking-tight text-foreground"
        >
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <HeartPulse className="size-4" />
          </span>
          <span className="max-[400px]:sr-only">{env.NEXT_PUBLIC_APP_NAME}</span>
          <span aria-hidden="true" className="h-5 w-px bg-border" />
          <span className="font-sans text-sm font-medium text-muted-foreground">Documentation</span>
        </Link>
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <PrintButton />
          <Button size="default" render={<Link href="/dashboard" />}>
            Open workspace
            <ArrowRight aria-hidden="true" data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </header>
  );
}
