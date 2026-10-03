import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** A placeholder block. Decorative, so hidden from assistive tech; the parent announces loading. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-muted/80 motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
