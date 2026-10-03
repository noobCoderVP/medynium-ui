"use client";

import { Command } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { CommandPalette } from "./command-palette";

/** The top-bar button for the command palette, which also opens on Ctrl/Cmd + K from anywhere. */
export function CommandPaletteTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Tooltip label="Command palette (Ctrl+K)">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open command palette"
          aria-keyshortcuts="Control+K Meta+K"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="max-md:hidden"
        >
          <Command aria-hidden="true" />
        </Button>
      </Tooltip>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
