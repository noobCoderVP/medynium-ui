import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const field =
  "h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-crit";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(field, className)} {...props} />;
}

/** A native select: the most accessible control for a short list, and it works on touch. */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(field, "pr-8", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(field, "h-auto min-h-20 py-2", className)} {...props} />;
}
