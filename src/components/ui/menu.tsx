"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A small action menu. Base UI handles arrow keys, typeahead, Escape and returning focus to the trigger. */
export function Menu({
  trigger,
  children,
  align = "end",
  side = "bottom",
  className,
}: {
  /** The button that opens the menu. It receives the trigger props. */
  trigger: ReactElement;
  children: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  className?: string;
}) {
  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger render={trigger} />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={6}
          className="z-50 outline-none"
        >
          <MenuPrimitive.Popup
            className={cn(
              "min-w-56 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg transition duration-100 outline-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
              className,
            )}
          >
            {children}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}

const itemClass =
  "flex min-h-9 w-full cursor-default items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50";

export function MenuItem({ className, ...props }: ComponentProps<typeof MenuPrimitive.Item>) {
  return <MenuPrimitive.Item className={cn(itemClass, className)} {...props} />;
}

export function MenuLabel({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-2.5 py-2", className)} {...props} />;
}

export function MenuSeparator() {
  return <MenuPrimitive.Separator className="my-1 h-px bg-border" />;
}
