import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Chapter from "@/components/layout/Chapter";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import ProofWalkthrough from "@/components/interactive/ProofWalkthrough";

export default function ProofSketch() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Chapter id="proof-sketch">
      <Container wide>
        <h2 className="font-serif text-3xl font-semibold text-ink mb-4 md:text-4xl">
          A sketch of the proof
        </h2>

        <p className="text-ink-secondary text-lg leading-relaxed mb-8 max-w-[48rem]">
          The full proof is technical, but the core logic is elegant. Here is
          the structure of Arrow's argument in four steps.
        </p>

        <div className="mb-8">
          <Button
            variant="secondary"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Hide proof sketch" : "Show proof sketch"}
          </Button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <ProofWalkthrough />

              <p className="mt-8 text-sm text-ink-tertiary leading-relaxed max-w-[48rem]">
                This is a simplified outline. Arrow's original 1951 paper
                contains the complete formal proof.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Chapter>
  );
}
