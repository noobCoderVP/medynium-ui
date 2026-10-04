import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** An inline spinner. Decorative: the control or region that owns it announces the busy state. */
export function Spinner({ className, ...props }: ComponentProps<typeof Loader2>) {
  return (
    <Loader2
      aria-hidden="true"
      className={cn("size-4 animate-spin motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
