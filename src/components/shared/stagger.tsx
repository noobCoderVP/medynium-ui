"use client";

import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { staggerContainer } from "@/lib/motion";

/** Reveals its StaggerItem children one after another. Use for card grids and stat rows. */
export function Stagger(props: ComponentProps<typeof motion.div>) {
  return <motion.div variants={staggerContainer} initial="hidden" animate="show" {...props} />;
}
