"use client";

import { LogOut, PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useSignOut } from "@/features/session";
import { cn } from "@/lib/utils";
import { useNavItems } from "../hooks/use-nav-items";
import { useSidebar } from "../hooks/use-sidebar";
import { NAV_GROUPS, isActive } from "../lib/nav";

/** Width, label and alignment classes. With no saved choice the breakpoint decides, so first paint has no jump. */
export function railClasses(preference: "expanded" | "collapsed" | null) {
  if (preference === "collapsed")
    return { rail: "w-16", label: "sr-only", row: "justify-center", divider: "" };
  if (preference === "expanded") return { rail: "w-56", label: "", row: "", divider: "hidden" };
  return {
    rail: "w-16 xl:w-56",
    label: "max-xl:sr-only",
    row: "max-xl:justify-center",
    divider: "xl:hidden",
  };
}

type RailCss = ReturnType<typeof railClasses>;

interface RailLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  css: RailCss;
}

/** The active background is a plain class, so it never animates when the rail changes width. */
function RailLink({ href, label, icon: Icon, active, collapsed, css }: RailLinkProps) {
  return (
    <Tooltip label={label} side="right" disabled={!collapsed}>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-muted transition-colors duration-150 outline-none hover:bg-white/10 hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/60",
          css.row,
          active &&
            "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className={css.label}>{label}</span>
      </Link>
    </Tooltip>
  );
}

/**
 * Left navigation. Labels show from 1280 px and icons only below that, until the user picks a width with the
 * toggle or Ctrl/Cmd + B; the choice is remembered. Collapsed icons get a tooltip. Hidden on phones (bottom tabs).
 */
export function NavRail() {
  const pathname = usePathname();
  const items = useNavItems();
  const signOut = useSignOut();
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
      {NAV_GROUPS.map((group, index) => {
        const groupItems = items.filter((item) => item.group === group.id);
        if (groupItems.length === 0) return null;
        return (
          <div key={group.id} className="flex flex-col gap-1" role="group" aria-label={group.label}>
            {index > 0 ? (
              <div className={cn("mx-2 my-1 h-px bg-sidebar-border", css.divider)} />
            ) : null}
            <p
              className={cn(
                "px-3 pt-2 pb-1 text-[0.7rem] font-semibold tracking-wider text-sidebar-muted uppercase",
                css.label,
              )}
            >
              {group.label}
            </p>
            {groupItems.map(({ href, label, icon: Icon }) => (
              <RailLink
                key={href}
                href={href}
                label={label}
                icon={Icon}
                active={isActive(pathname, href)}
                collapsed={collapsed}
                css={css}
              />
            ))}
          </div>
        );
      })}
      <div className="mt-auto border-t border-sidebar-border pt-2">
        <Tooltip label="Sign out" side="right" disabled={!collapsed}>
          <button
            type="button"
            onClick={() => signOut.mutate()}
            disabled={signOut.isPending}
            className={cn(
              "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-muted transition-colors duration-150 outline-none hover:bg-white/10 hover:text-sidebar-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/60 disabled:opacity-60",
              css.row,
            )}
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            <span className={css.label}>Sign out</span>
          </button>
        </Tooltip>
      </div>
    </nav>
  );
}
