"use client";

import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { useFocusMode } from "../hooks/focus-mode";

/** The only chrome left in focus mode: where you are, and the way out. */
export function FocusBar() {
  const { exit } = useFocusMode();
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/90 px-3 backdrop-blur md:px-5">
      <p className="text-sm font-medium">
        {env.NEXT_PUBLIC_APP_NAME} <span className="text-muted-foreground">· Focus mode</span>
      </p>
      <Button variant="outline" size="sm" onClick={exit} aria-keyshortcuts="Control+Shift+F">
        <Minimize2 aria-hidden="true" />
        Exit focus
      </Button>
    </header>
  );
}
