import { cn } from "@/lib/utils";

/**
 * A snowflake glyph in Snowflake's brand blue, drawn inline so nothing loads from a third party. Decorative: the
 * words beside it carry the meaning. Swap in the official asset here if brand rules call for it.
 */
export function SnowflakeLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#29B5E8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 shrink-0", className)}
    >
      {[0, 60, 120].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 12 12)`}>
          <path d="M12 2v20M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />
        </g>
      ))}
    </svg>
  );
}
