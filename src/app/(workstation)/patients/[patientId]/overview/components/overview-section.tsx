import type { ReactNode } from "react";

/** A labelled group on the overview, so cards read as sections (snapshot, overview, activity) not a flat pile. */
export function OverviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="space-y-2">
      <h2 className="border-b border-border pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
