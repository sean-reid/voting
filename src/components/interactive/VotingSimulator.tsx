import { useMemo } from "react";
import { motion } from "motion/react";
import type { PreferenceProfile, VotingMethodWithDetails } from "../../lib/voting/types";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface MethodConfig {
  name: string;
  compute: VotingMethodWithDetails;
}

interface VotingSimulatorProps {
  profile: PreferenceProfile;
  candidates: string[];
  methods: MethodConfig[];
}

function VotingSimulator({ profile, candidates, methods }: VotingSimulatorProps) {
  const results = useMemo(
    () => methods.map((m) => ({ name: m.name, result: m.compute(profile, candidates) })),
    [profile, candidates, methods]
  );

  const winners = results.map((r) => r.result.ranking[0]);
  const allSameWinner = winners.every((w) => w === winners[0]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((entry, methodIndex) => {
          const maxScore = Math.max(
            ...Object.values(entry.result.details),
            1
          );
          const winner = entry.result.ranking[0];
          const sortedCandidates = [...entry.result.ranking];

          return (
            <Card key={entry.name} hover>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-semibold text-ink">
                    {entry.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-tertiary">Winner:</span>
                  {entry.result.tiedWinners ? (
                    <Badge variant="muted-red">Tie</Badge>
                  ) : (
                    <Badge variant="terracotta">{winner}</Badge>
                  )}
                </div>
                <div
                  className="space-y-2"
                  role="list"
                  aria-label={`${entry.name} scores`}
                >
                  {sortedCandidates.map((candidate, candIndex) => {
                    const score = entry.result.details[candidate] ?? 0;
                    const widthPercent = (score / maxScore) * 100;
                    const isWinner = candidate === winner;

                    return (
                      <div
                        key={candidate}
                        className="space-y-0.5"
                        role="listitem"
                        aria-label={`${candidate}: ${score} points`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`font-medium ${
                              isWinner ? "text-terracotta" : "text-ink-secondary"
                            }`}
                          >
                            {candidate}
                          </span>
                          <span className="text-ink-tertiary tabular-nums">
                            {score}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              isWinner ? "bg-terracotta" : "bg-slate-light"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPercent}%` }}
                            transition={{
                              duration: 0.6,
                              delay: methodIndex * 0.1 + candIndex * 0.05,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {!allSameWinner && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-lg border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta-dark"
          role="alert"
        >
          Same votes, different winners.
        </motion.div>
      )}
    </div>
  );
}

export default VotingSimulator;
