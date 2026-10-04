import type { ReactNode } from "react";

/**
 * The one layout for a list page: toolbar, optional summary, a table that takes the remaining viewport height (its
 * header stays pinned, only the rows scroll) and the pagination footer. Pair it with `<DataTable fill>`. Under
 * 1024 px it stacks and the page scrolls normally.
 */
export function TablePanel({
  toolbar,
  summary,
  footer,
  children,
}: {
  toolbar?: ReactNode;
  summary?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div data-fit className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      {toolbar}
      <div className="flex min-h-0 flex-col gap-3 lg:flex-1">
        {summary}
        <div className="min-h-0">{children}</div>
        {footer}
      </div>
    </div>
  );
}
