import Link from "next/link";
import { cn } from "@/lib/utils";
import { TABS, type TabId } from "../lib/tabs";

/**
 * Patient sections as links to ?tab=. Plain links with aria-current are the simplest accessible pattern and
 * keep every view linkable. On phones the row scrolls sideways inside its own box, not the page.
 */
export function TabBar({ patientId, active }: { patientId: string; active: TabId }) {
  return (
    <nav
      aria-label="Patient sections"
      className="-mx-1 overflow-x-auto border-b border-border px-1"
    >
      <ul className="flex min-w-max gap-1">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <Link
              href={`/patients/${encodeURIComponent(patientId)}?tab=${tab.id}`}
              aria-current={tab.id === active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium md:min-h-10",
                tab.id === active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
