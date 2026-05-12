import { type ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";

interface ChapterProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export default function Chapter({ children, id, className = "" }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} id={id} className={`py-24 md:py-32 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
