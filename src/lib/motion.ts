import type { Transition, Variants } from "framer-motion";

/** One easing curve and short durations everywhere, so motion reads as a single system. */
export const easeOut: Transition = { duration: 0.24, ease: [0.22, 1, 0.36, 1] };
export const spring: Transition = { type: "spring", stiffness: 420, damping: 36 };

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: easeOut },
};
