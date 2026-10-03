"use client";

import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { staggerItem } from "@/lib/motion";

export function StaggerItem(props: ComponentProps<typeof motion.div>) {
  return <motion.div variants={staggerItem} {...props} />;
}
