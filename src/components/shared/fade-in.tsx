"use client";

import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { easeOut } from "@/lib/motion";

/** Fades and lifts its children in once on mount. Reduced motion is honoured by the app-wide MotionConfig. */
export function FadeIn({
  delay = 0,
  ...props
}: ComponentProps<typeof motion.div> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...easeOut, delay }}
      {...props}
    />
  );
}
