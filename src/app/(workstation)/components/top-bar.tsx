import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AskForm, PanelToggle } from "@/features/agent-panel";
import { env } from "@/lib/env";
import { PatientSearch } from "./patient-search";
import { UserMenu } from "./user-menu";

/** Brand, patient search, the ask-or-do command bar, assistant toggle, theme and user. */
export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-3 md:px-4">
      <Link
        href="/dashboard"
        className="shrink-0 text-lg font-semibold tracking-tight text-primary"
      >
        {env.NEXT_PUBLIC_APP_NAME}
      </Link>
      <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
        <PatientSearch />
        <AskForm className="w-full max-w-xl" />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <PanelToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
