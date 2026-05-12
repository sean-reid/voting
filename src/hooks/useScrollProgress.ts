import { useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

export function useScrollProgress(): {
  ref: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return { ref, progress };
}
