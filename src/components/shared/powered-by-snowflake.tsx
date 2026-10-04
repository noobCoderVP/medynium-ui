import { cn } from "@/lib/utils";
import { SnowflakeLogo } from "./snowflake-logo";

/** A one-line credit that takes almost no room: used under the assistant, on sign-in and in the docs footer. */
export function PoweredBySnowflake({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center justify-center gap-1.5 text-[0.7rem] text-muted-foreground",
        className,
      )}
    >
      <SnowflakeLogo className="size-3" />
      <span>
        Powered by <span className="font-medium text-foreground">Snowflake</span>
      </span>
    </p>
  );
}
