/** A titled strip of related figures (for example utilization, or billed and approved) in one card. */
export function StatGroup({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <section
      aria-label={title}
      className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
    >
      <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      <dl className="mt-1.5 flex flex-wrap gap-x-6 gap-y-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dd className="text-lg font-bold tabular-nums">{value}</dd>
            <dt className="text-xs text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
