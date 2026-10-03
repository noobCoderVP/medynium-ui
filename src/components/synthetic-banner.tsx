import { copy } from "@/lib/copy";

/** Required on every screen that shows patient data (SEC-08, AI-07). Visible, not alarming. */
export function SyntheticBanner() {
  return (
    <div role="note" className="bg-warn-soft px-4 py-1 text-center text-xs text-warn">
      {copy.banner}
    </div>
  );
}
