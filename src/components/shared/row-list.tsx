import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** A divided list for card bodies. Rows get a soft hover and even padding so lists read as one pattern. */
export function RowList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("-mx-2 divide-y divide-border text-sm", className)} {...props} />;
}

export function Row({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn("rounded-md px-2 py-3 transition-colors hover:bg-muted/40", className)}
      {...props}
    />
  );
}
