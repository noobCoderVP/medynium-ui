"use client";

import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useFocusMode } from "../hooks/focus-mode";

/** Enters focus mode. Exiting is the button in the slim focus bar. */
export function FocusToggle() {
  const { toggle } = useFocusMode();
  return (
    <Tooltip label="Focus mode (Ctrl+Shift+F)">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Enter focus mode"
        aria-keyshortcuts="Control+Shift+F Meta+Shift+F"
        onClick={toggle}
        className="max-md:hidden"
      >
        <Maximize2 aria-hidden="true" />
      </Button>
    </Tooltip>
  );
}
