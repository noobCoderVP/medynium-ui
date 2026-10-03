"use client";

import { motion } from "framer-motion";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MenuItem } from "@/components/ui/menu";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useNavItems } from "../hooks/use-nav-items";
import { isActive } from "../lib/nav";

const tabClass =
  "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[0.7rem] font-medium outline-none focus-visible:bg-sidebar-accent";

function ActiveBar() {
  return (
    <motion.span
      layoutId="tab-active"
      transition={spring}
      className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-sidebar-primary"
      aria-hidden="true"
    />
  );
}

/**
 * Phone navigation (under 768 px). 56 px targets. The primary destinations get a tab each and everything else
 * sits under More, so the bar stays at four items however many sections there are.
 */
export function BottomTabs() {
  const pathname = usePathname();
  const items = useNavItems();
  const tabs = items.filter((item) => item.primary);
  const more = items.filter((item) => !item.primary);
  const moreActive = more.some((item) => isActive(pathname, item.href));
  return (
    <nav
      aria-label="Main"
      className="flex shrink-0 border-t border-sidebar-border bg-sidebar md:hidden"
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(tabClass, active ? "text-sidebar-foreground" : "text-sidebar-muted")}
          >
            {active ? <ActiveBar /> : null}
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
      {more.length > 0 ? (
        <Menu
          side="top"
          trigger={
            <button
              type="button"
              className={cn(
                tabClass,
                moreActive ? "text-sidebar-foreground" : "text-sidebar-muted",
              )}
            >
              {moreActive ? <ActiveBar /> : null}
              <Ellipsis className="size-5" aria-hidden="true" />
              More
            </button>
          }
        >
          {more.map(({ href, label, icon: Icon }) => (
            <MenuItem
              key={href}
              render={
                <Link href={href} aria-current={isActive(pathname, href) ? "page" : undefined} />
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </MenuItem>
          ))}
        </Menu>
      ) : null}
    </nav>
  );
}
