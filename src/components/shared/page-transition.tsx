"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { easeOut } from "@/lib/motion";

/** A short fade-up when the route changes. Enter-only, so navigation never waits on an exit animation. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={easeOut}
      className="space-y-5"
    >
      {children}
    </motion.div>
  );
}
