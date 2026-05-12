import { MotionConfig } from "motion/react";
import { type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function LazyMotionConfig({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <MotionConfig
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
      }
    >
      {children}
    </MotionConfig>
  );
}
