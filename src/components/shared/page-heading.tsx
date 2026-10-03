import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/** Title row for a workspace page: one h1, an optional note under it and actions on the right. */
export function PageHeading({
  title,
  note,
  actions,
  crumbs,
}: {
  title: string;
  note?: ReactNode;
  actions?: ReactNode;
  crumbs?: Crumb[];
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
      <div className="min-w-0">
        {crumbs ? <Breadcrumbs crumbs={crumbs} /> : null}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {note ? <p className="mt-1.5 text-sm text-muted-foreground">{note}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
