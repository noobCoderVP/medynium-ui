"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Side = "top" | "right" | "bottom" | "left";

/** Wrap the app once so neighbouring tooltips open without the usual delay after the first. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipPrimitive.Provider delay={300}>{children}</TooltipPrimitive.Provider>;
}

/**
 * A short visible name for an icon-only control. Opens on hover and on keyboard focus, and Base UI links it to the
 * trigger for screen readers. It only repeats the control's label, so nothing here is hover-only content.
 */
export function Tooltip({
  label,
  side = "bottom",
  disabled = false,
  className,
  children,
}: {
  label: ReactNode;
  side?: Side;
  disabled?: boolean;
  className?: string;
  /** The single element that triggers the tooltip. It receives the trigger props. */
  children: ReactElement;
}) {
  if (disabled) return children;
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={8} className="z-50">
          <TooltipPrimitive.Popup
            className={cn(
              "rounded-md border border-border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md transition duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
              className,
            )}
          >
            {label}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
