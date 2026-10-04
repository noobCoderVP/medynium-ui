import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const fieldClass =
  "h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-xs transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted-foreground hover:border-ring/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-[invalid=true]:border-crit aria-[invalid=true]:ring-crit/20 dark:bg-background";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "h-auto min-h-20 py-2", className)} {...props} />;
}
