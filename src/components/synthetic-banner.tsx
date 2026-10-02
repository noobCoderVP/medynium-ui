/** Required on every screen that shows patient data (SEC-08, AI-07). */
export function SyntheticBanner() {
  return (
    <div
      role="note"
      className="bg-amber-100 px-4 py-1 text-center text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200"
    >
      Synthetic data. Decision support only, not a diagnosis or treatment tool.
    </div>
  );
}
