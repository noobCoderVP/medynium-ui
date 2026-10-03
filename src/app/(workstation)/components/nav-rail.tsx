"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNavItems } from "../hooks/use-nav-items";
import { isActive } from "../lib/nav";

/** Left navigation: labels at 1280 and up, icons only between 768 and 1279, hidden on phones (bottom tabs). */
export function NavRail() {
  const pathname = usePathname();
  const items = useNavItems();
  return (
    <nav
      aria-label="Main"
      className="hidden w-14 shrink-0 flex-col gap-1 border-r border-border bg-sidebar p-2 md:flex xl:w-52"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium hover:bg-sidebar-accent",
              active && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="max-xl:sr-only">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
