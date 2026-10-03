"use client";

import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useNavItems } from "../hooks/use-nav-items";
import { useSidebar } from "../hooks/use-sidebar";
import { isActive } from "../lib/nav";

/** Width, label and alignment classes. With no saved choice the breakpoint decides, so first paint has no jump. */
export function railClasses(preference: "expanded" | "collapsed" | null) {
  if (preference === "collapsed") return { rail: "w-16", label: "sr-only", row: "justify-center" };
  if (preference === "expanded") return { rail: "w-56", label: "", row: "" };
  return { rail: "w-16 xl:w-56", label: "max-xl:sr-only", row: "max-xl:justify-center" };
}

/**
 * Left navigation. Labels show from 1280 px and icons only below that, until the user picks a width with the
 * toggle or Ctrl/Cmd + B; the choice is remembered. Collapsed icons get a tooltip. Hidden on phones (bottom tabs).
 */
export function NavRail() {
  const pathname = usePathname();
  const items = useNavItems();
  const { collapsed, preference, toggle } = useSidebar({ shortcut: true });
  const css = railClasses(preference);
  const toggleLabel = collapsed ? "Expand sidebar" : "Collapse sidebar";
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return (
    <nav
      id="main-nav"
      aria-label="Main"
      className={cn(
        "hidden shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar p-2 pt-4 transition-[width] duration-200 ease-out motion-reduce:transition-none md:flex",
        css.rail,
      )}
    >
      <div className={cn("mb-1 flex", collapsed ? "justify-center" : "justify-end")}>
        <Tooltip label={`${toggleLabel} (Ctrl+B)`} side="right">
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-muted hover:bg-white/10 hover:text-sidebar-foreground aria-expanded:bg-transparent aria-expanded:text-sidebar-muted aria-expanded:hover:bg-white/10 aria-expanded:hover:text-sidebar-foreground dark:hover:bg-white/10"
            aria-label={toggleLabel}
            aria-expanded={!collapsed}
            aria-controls="main-nav"
            aria-keyshortcuts="Control+B Meta+B"
            onClick={toggle}
          >
            <ToggleIcon aria-hidden="true" />
          </Button>
        </Tooltip>
      </div>
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Tooltip key={href} label={label} side="right" disabled={!collapsed}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-muted transition-colors duration-150 outline-none hover:bg-white/10 hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/60",
                css.row,
                active && "text-sidebar-accent-foreground hover:text-sidebar-accent-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="nav-active"
                  transition={spring}
                  className="absolute inset-0 rounded-lg bg-sidebar-accent shadow-sm"
                  aria-hidden="true"
                />
              ) : null}
              <Icon className="relative size-4 shrink-0" aria-hidden="true" />
              <span className={cn("relative", css.label)}>{label}</span>
            </Link>
          </Tooltip>
        );
      })}
    </nav>
  );
}
