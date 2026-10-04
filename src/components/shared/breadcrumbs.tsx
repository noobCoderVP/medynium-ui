import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface Crumb {
  label: string;
  /** Omit on the last crumb, the page you are on. */
  href?: string;
}

/** "Where am I?" trail. The last crumb is the current page and is not a link. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-1 text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li key={`${i}-${crumb.label}`} className="flex min-w-0 items-center gap-1">
            {i > 0 ? <ChevronRight className="size-3 shrink-0" aria-hidden="true" /> : null}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link href={crumb.href} className="truncate hover:text-foreground hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate font-semibold text-foreground">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
