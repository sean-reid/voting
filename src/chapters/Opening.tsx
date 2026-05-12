import { motion } from "motion/react";
import ScrollCue from "@/components/layout/ScrollCue";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function Opening() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-paper to-surface px-6">
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="max-w-3xl font-serif font-semibold leading-tight text-ink"
          style={{ fontSize: "clamp(2.25rem, 5vw + 0.5rem, 4.5rem)" }}
          variants={fadeUp}
        >
          Arrow's Impossibility Theorem
        </motion.h1>

        <motion.p
          className="max-w-xl text-lg text-ink-secondary md:text-xl"
          variants={fadeUp}
        >
          An interactive exploration of fairness in voting systems
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <ScrollCue />
      </motion.div>
    </section>
  );
}
