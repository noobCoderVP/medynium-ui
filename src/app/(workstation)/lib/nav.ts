import {
  BookOpen,
  History,
  ListChecks,
  LifeBuoy,
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
  /** Clinical work, or the support tools around it. The desktop rail shows one heading per group. */
  group: "workspace" | "support";
}

export const NAV_GROUPS = [
  { id: "workspace", label: "Workspace" },
  { id: "support", label: "Support" },
] as const;

/** The workstation's sections (05 section 3). Admin shows for administrators only; the server enforces it too. */
export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    primary: true,
    group: "workspace",
  },
  { href: "/patients", label: "Patients", icon: Users, primary: true, group: "workspace" },
  { href: "/pending", label: "Pending work", icon: ListChecks, primary: true, group: "workspace" },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen, group: "workspace" },
  { href: "/activity", label: "Activity log", icon: History, primary: true, group: "support" },
  { href: "/docs", label: "Documentation", icon: LifeBuoy, group: "support" },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true, group: "support" },
];

export const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);
