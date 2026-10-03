"use client";

import { useMe } from "@/features/session";
import { NAV_ITEMS } from "../lib/nav";

/** Role-aware navigation: Admin appears for doctors flagged as administrators. */
export function useNavItems() {
  const me = useMe();
  const admin = Boolean(me.data?.is_admin && me.data.role === "DOCTOR");
  return NAV_ITEMS.filter((item) => !item.adminOnly || admin);
}
