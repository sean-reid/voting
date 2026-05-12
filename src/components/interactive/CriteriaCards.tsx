import { motion } from "motion/react";

interface CriterionData {
  name: string;
  satisfied: boolean;
  description: string;
  counterexample?: string;
}

interface CriteriaCardsProps {
  results: CriterionData[];
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 10.5 L8.5 14 L15 6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 5 L15 15 M15 5 L5 15" />
    </svg>
  );
}

function CriteriaCards({ results }: CriteriaCardsProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      role="list"
      aria-label="Voting criteria results"
    >
      {results.map((criterion, index) => (
        <motion.div
          key={criterion.name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            ease: "easeOut",
          }}
          className="bg-surface border border-border rounded-xl p-5 space-y-3"
          role="listitem"
          aria-label={`${criterion.name}: ${criterion.satisfied ? "satisfied" : "violated"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-base font-semibold text-ink">
              {criterion.name}
            </h3>
            <div
              className={`flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                criterion.satisfied
                  ? "bg-sage/15 text-sage"
                  : "bg-muted-red/15 text-muted-red"
              }`}
            >
              {criterion.satisfied ? <CheckIcon /> : <XIcon />}
              <span>{criterion.satisfied ? "Satisfied" : "Violated"}</span>
            </div>
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {criterion.description}
          </p>
          {!criterion.satisfied && criterion.counterexample && (
            <div className="rounded-md bg-muted-red/5 border border-muted-red/20 px-3 py-2">
              <p className="text-xs text-muted-red-dark">
                {criterion.counterexample}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default CriteriaCards;
