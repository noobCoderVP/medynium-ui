"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useNavItems } from "../hooks/use-nav-items";
import { isActive } from "../lib/nav";

/** Phone navigation (under 768 px). 44 px targets, the same destinations as the rail. */
export function BottomTabs() {
  const pathname = usePathname();
  const items = useNavItems();
  return (
    <nav aria-label="Main" className="flex shrink-0 border-t border-border bg-sidebar md:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[0.7rem] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {active ? (
              <motion.span
                layoutId="tab-active"
                transition={spring}
                className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary"
                aria-hidden="true"
              />
            ) : null}
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
