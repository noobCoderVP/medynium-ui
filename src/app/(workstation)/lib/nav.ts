import {
  BookOpen,
  History,
  LayoutDashboard,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  /** Gets its own tab on a phone; the rest go under More. */
  primary?: boolean;
}

/** The workstation's sections (05 section 3). Admin shows for administrators only; the server enforces it too. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, primary: true },
  { href: "/patients", label: "Patients", icon: Users, primary: true },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/activity", label: "Activity log", icon: History, primary: true },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
];

export const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);
