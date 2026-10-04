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
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="min-w-0">
        {crumbs ? <Breadcrumbs crumbs={crumbs} /> : null}
        <h1>{title}</h1>
        {note ? <p className="mt-0.5 text-sm text-muted-foreground">{note}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
