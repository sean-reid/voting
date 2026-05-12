import { motion } from "motion/react";

export default function ScrollCue() {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 text-ink-tertiary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <span className="text-sm tracking-wide">Scroll to explore</span>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M10 3 L10 17" />
        <path d="M4 11 L10 17 L16 11" />
      </motion.svg>
    </motion.div>
  );
}
