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

/**
 * Brand, patient search, the ask-or-do command bar, assistant toggle, theme and account. From 1024 px the search and
 * command bar sit in the bar; below that the search is an icon and the Ask AI button opens the assistant panel.
 */
export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/90 px-3 backdrop-blur md:px-5">
      <Link
        href="/dashboard"
        className="flex shrink-0 items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground"
      >
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <HeartPulse className="size-4" />
        </span>
        <span className="max-[400px]:sr-only">{env.NEXT_PUBLIC_APP_NAME}</span>
      </Link>
      <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
        <PatientSearch className="w-full max-w-64 shrink-0" />
        <AskForm className="w-full max-w-xl" />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <MobileSearch />
        <CommandPaletteTrigger />
        <FocusToggle />
        <PanelToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
