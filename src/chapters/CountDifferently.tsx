import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Chapter from "@/components/layout/Chapter";
import Container from "@/components/layout/Container";
import PreferenceOrdering from "@/components/interactive/PreferenceOrdering";
import VotingSimulator from "@/components/interactive/VotingSimulator";
import { restaurantScenario } from "@/data/scenarios";
import { pluralityWithDetails } from "@/lib/voting/plurality";
import { bordaWithDetails } from "@/lib/voting/borda";
import { irvWithDetails } from "@/lib/voting/irv";
import type { Ranking } from "@/lib/voting/types";

const METHODS = [
  { name: "Plurality", compute: pluralityWithDetails },
  { name: "Borda Count", compute: bordaWithDetails },
  { name: "Instant Runoff", compute: irvWithDetails },
];

export default function CountDifferently() {
  const { candidates, voters } = restaurantScenario;

  const [rankings, setRankings] = useState<Ranking[]>(
    voters.map((v) => [...v.ranking])
  );

  function updateRanking(index: number, newRanking: Ranking) {
    setRankings((prev) => prev.map((r, i) => (i === index ? newRanking : r)));
  }

  const profile = useMemo(() => rankings, [rankings]);

  const winners = useMemo(
    () => METHODS.map((m) => m.compute(profile, candidates).ranking[0]),
    [profile, candidates]
  );

  const allSameWinner = winners.every((w) => w === winners[0]);

  return (
    <Chapter id="count-differently">
      <Container wide>
        <h2 className="mb-3 font-serif text-3xl font-semibold md:text-4xl">
          Different methods, different winners
        </h2>
        <p className="mb-10 max-w-prose text-ink-secondary">
          The same set of preferences can produce different outcomes depending on
          how the votes are counted.
        </p>

        <p className="mb-4 text-sm text-ink-secondary">
          Drag to reorder each voter's preferences, then compare the results
          below.
        </p>

        <div className="mb-10 grid gap-8 sm:grid-cols-3">
          {voters.map((voter, i) => (
            <PreferenceOrdering
              key={voter.name}
              candidates={candidates}
              ranking={rankings[i]!}
              onChange={(r) => updateRanking(i, r)}
              label={voter.name}
            />
          ))}
        </div>

        <VotingSimulator
          profile={profile}
          candidates={candidates}
          methods={METHODS}
        />

        <AnimatePresence>
          {!allSameWinner && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-6 rounded-lg border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta-dark"
            >
              The outcome depends on the counting method, not just the votes.
            </motion.p>
          )}
        </AnimatePresence>
      </Container>
    </Chapter>
  );
}
