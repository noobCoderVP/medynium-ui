"use client";

import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AskForm, PanelToggle } from "@/features/agent-panel";
import { env } from "@/lib/env";
import { CommandPaletteTrigger } from "./command-palette-trigger";
import { FocusToggle } from "./focus-toggle";
import { MobileSearch } from "./mobile-search";
import { PatientSearch } from "./patient-search";
import { UserMenu } from "./user-menu";
import { useSidebar } from "../hooks/use-sidebar";
import { railClasses } from "./nav-rail";
import { cn } from "@/lib/utils";

/**
 * Brand, patient search, the ask-or-do command bar, assistant toggle, theme and account. From 1024 px the search and
 * command bar sit in the bar; below that the search is an icon and the Ask AI button opens the assistant panel.
 */
export function TopBar() {
  const { preference } = useSidebar();
  const css = railClasses(preference);
  return (
    <header className="relative z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/90 pr-3 pl-3 backdrop-blur md:pr-5 md:pl-0">
      <Link
        href="/dashboard"
        className={cn(
          "flex h-full shrink-0 items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground md:px-4 md:transition-[width] md:duration-200 md:ease-out md:motion-reduce:transition-none",
          css.rail,
          css.row,
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <HeartPulse className="size-4" />
        </span>
        <span className={cn("max-[400px]:sr-only", css.label)}>{env.NEXT_PUBLIC_APP_NAME}</span>
      </Link>
      <div className="hidden min-w-0 flex-1 items-center gap-3 md:pl-5 lg:flex">
        <PatientSearch className="w-full max-w-64 shrink-0" />
        <AskForm className="w-full max-w-xl" />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <MobileSearch />
        <div className="flex items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
          <CommandPaletteTrigger />
          <FocusToggle />
          <ThemeToggle />
        </div>
        <PanelToggle />
        <span aria-hidden="true" className="h-6 w-px bg-border" />
        <UserMenu />
      </div>
    </header>
  );
}
