"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** The responsive row of StatTiles. A description list, so each label stays tied to its value. */
export function StatGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.dl
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6", className)}
    >
      {children}
    </motion.dl>
  );
}
