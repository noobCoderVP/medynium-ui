"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer } from "@/lib/motion";

/** The responsive row of StatTiles. A description list, so each label stays tied to its value. */
export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <motion.dl
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
    >
      {children}
    </motion.dl>
  );
}
