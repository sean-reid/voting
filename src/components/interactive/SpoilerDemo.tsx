import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { pluralityWithDetails } from "../../lib/voting/plurality";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const VOTERS_TWO_CANDIDATE = [
  ["A", "B"],
  ["A", "B"],
  ["B", "A"],
  ["B", "A"],
  ["A", "B"],
];

const VOTERS_THREE_CANDIDATE = [
  ["A", "C", "B"],
  ["A", "C", "B"],
  ["B", "A", "C"],
  ["B", "A", "C"],
  ["C", "B", "A"],
];

function voterLabel(index: number): string {
  return `Voter ${index + 1}`;
}

interface PanelProps {
  title: string;
  voters: string[][];
  candidates: string[];
  highlight: boolean;
}

function ElectionPanel({ title, voters, candidates, highlight }: PanelProps) {
  const result = useMemo(
    () => pluralityWithDetails(voters, candidates),
    [voters, candidates]
  );

  const winner = result.ranking[0];
  const maxScore = Math.max(...Object.values(result.details), 1);

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wider">
            Preferences
          </p>
          {voters.map((ballot, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm"
              role="listitem"
              aria-label={`${voterLabel(i)}: ${ballot.join(" then ")}`}
            >
              <span className="text-ink-tertiary min-w-[4rem] text-xs">
                {voterLabel(i)}
              </span>
              <span className="text-ink-secondary">
                {ballot.join(" > ")}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-3 space-y-2">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wider">
            Plurality Result
          </p>
          {result.ranking.map((candidate) => {
            const score = result.details[candidate] ?? 0;
            const pct = (score / maxScore) * 100;
            const isTied = result.tiedWinners?.includes(candidate);
            const isWinner = !result.tiedWinners && candidate === winner;
            const highlighted = isWinner || isTied;
            return (
              <div key={candidate} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={highlighted ? "font-semibold text-terracotta" : "text-ink-secondary"}
                  >
                    {candidate}
                  </span>
                  <span className="text-ink-tertiary tabular-nums">
                    {score} vote{score !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      highlighted ? "bg-terracotta" : "bg-slate-light"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-ink-tertiary">Winner:</span>
            {result.tiedWinners ? (
              <Badge variant="muted-red">Tie</Badge>
            ) : (
              <Badge variant={highlight ? "muted-red" : "terracotta"}>{winner}</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function SpoilerDemo() {
  const [showThirdCandidate, setShowThirdCandidate] = useState(false);

  const twoCandResult = useMemo(
    () => pluralityWithDetails(VOTERS_TWO_CANDIDATE, ["A", "B"]),
    []
  );
  const threeCandResult = useMemo(
    () => pluralityWithDetails(VOTERS_THREE_CANDIDATE, ["A", "B", "C"]),
    []
  );

  const originalWinner = twoCandResult.ranking[0];
  const newWinner = threeCandResult.ranking[0];
  const threeCandTied = threeCandResult.tiedWinners !== undefined;
  const spoilerEffect =
    showThirdCandidate && (originalWinner !== newWinner || threeCandTied);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ElectionPanel
          title="A vs B"
          voters={VOTERS_TWO_CANDIDATE}
          candidates={["A", "B"]}
          highlight={false}
        />
        <AnimatePresence mode="wait">
          {showThirdCandidate ? (
            <motion.div
              key="three"
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ElectionPanel
                title="A vs B vs C"
                voters={VOTERS_THREE_CANDIDATE}
                candidates={["A", "B", "C"]}
                highlight={spoilerEffect}
              />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/50 p-8 gap-3 min-h-[200px]"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" className="text-border-strong" />
                <text x="24" y="25" textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="600" className="fill-ink-tertiary">C</text>
              </svg>
              <p className="text-sm text-ink-tertiary text-center">
                Click below to add candidate C and see what changes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button
          variant={showThirdCandidate ? "secondary" : "primary"}
          onClick={() => setShowThirdCandidate(!showThirdCandidate)}
          aria-label={
            showThirdCandidate
              ? "Remove candidate C from the election"
              : "Add candidate C to the election"
          }
        >
          {showThirdCandidate ? "Remove candidate C" : "Add candidate C"}
        </Button>
        <AnimatePresence>
          {spoilerEffect && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-muted-red-dark text-center rounded-lg border border-muted-red/30 bg-muted-red/5 px-4 py-2"
              role="alert"
            >
              {threeCandTied
                ? `Adding C created a tie between ${threeCandResult.tiedWinners!.join(" and ")}, even though ${originalWinner} wins head-to-head.`
                : `Adding C changed the winner from ${originalWinner} to ${newWinner}, even though voters still prefer ${originalWinner} over ${newWinner} in head-to-head comparison.`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SpoilerDemo;
