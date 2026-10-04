import { cn } from "@/lib/utils";

// The two paths of the Medynium mark (the heart and the pulse line through it), 24-unit grid.
const HEART =
  "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5";
const PULSE = "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27";

/**
 * The app loader: the logo's heart traced in a loop while a pulse line sweeps through it and the heart beats
 * with each spike. Decorative; the region that owns it announces the busy state. By default it is centred over
 * the whole content window (the nearest positioned ancestor, the workspace panel); `compact` is for dialogs and small panels.
 */
export function HeartbeatLoader({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-primary",
        compact ? "min-h-40 w-full py-8" : "pointer-events-none absolute inset-0 z-10",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn("hb-beat overflow-visible", compact ? "size-14" : "size-24")}
      >
        <g className="opacity-15">
          <path d={HEART} />
          <path d={PULSE} />
        </g>
        <path d={HEART} pathLength={100} className="hb-chase" />
        <path d={PULSE} pathLength={100} strokeWidth="1.9" className="hb-pulse" />
      </svg>
    </div>
  );
}
