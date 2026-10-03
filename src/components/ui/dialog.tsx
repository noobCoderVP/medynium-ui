"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "./tooltip";

type Placement = "center" | "right" | "bottom";

const placement: Record<Placement, string> = {
  center:
    "left-1/2 top-1/2 max-h-[85dvh] w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl",
  // A side drawer on desktop, full screen on a phone (05 section 10).
  right:
    "inset-0 md:left-auto md:w-[min(34rem,100vw)] md:border-l translate-x-0 data-[starting-style]:translate-x-8 data-[ending-style]:translate-x-8",
  bottom:
    "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-xl data-[starting-style]:translate-y-6 data-[ending-style]:translate-y-6",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  placement?: Placement;
  children: ReactNode;
  className?: string;
}

/**
 * Modal dialog or drawer. Base UI moves focus in on open, returns it to the trigger on close, closes on
 * Esc and makes the rest of the page inert, which is what the accessibility rules in 05 section 9 ask for.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  placement: where = "center",
  children,
  className,
}: Props) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden border border-border bg-popover text-popover-foreground shadow-lg transition duration-150 outline-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            placement[where],
            where === "right" && "md:inset-y-0 md:right-0",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-base font-semibold">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <Tooltip label="Close">
              <DialogPrimitive.Close
                aria-label="Close"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-muted md:size-9"
              >
                <X className="size-4" aria-hidden="true" />
              </DialogPrimitive.Close>
            </Tooltip>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
