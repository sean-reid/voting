import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Chapter from "@/components/layout/Chapter";
import Container from "@/components/layout/Container";
import PreferenceOrdering from "@/components/interactive/PreferenceOrdering";
import { restaurantScenario } from "@/data/scenarios";
import { pluralityWithDetails } from "@/lib/voting/plurality";
import type { Ranking } from "@/lib/voting/types";

export default function ThreeFriends() {
  const { candidates, voters } = restaurantScenario;

  const [rankings, setRankings] = useState<Ranking[]>(
    voters.map((v) => [...v.ranking])
  );

  function updateRanking(index: number, newRanking: Ranking) {
    setRankings((prev) => prev.map((r, i) => (i === index ? newRanking : r)));
  }

  const result = useMemo(
    () => pluralityWithDetails(rankings, candidates),
    [rankings, candidates]
  );

  const winner = result.ranking[0] ?? "";
  const winnerVotes = result.details[winner] ?? 0;

  return (
    <Chapter id="three-friends">
      <Container>
        <h2 className="mb-3 font-serif text-3xl font-semibold md:text-4xl">
          Picking a restaurant
        </h2>
        <p className="mb-10 max-w-prose text-ink-secondary">
          Three friends are deciding where to eat. Each has their own
          preferences.
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

        <AnimatePresence mode="wait">
          <motion.div
            key={winner}
            className="rounded-xl border border-border bg-surface px-6 py-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-sm font-medium text-ink-tertiary">
              Plurality winner
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-ink">
              {winner}
            </p>
            <p className="mt-1 text-sm text-ink-secondary">
              {winnerVotes} of {voters.length} first-place votes
            </p>
          </motion.div>
        </AnimatePresence>

        <p className="mt-12 text-ink-secondary">
          Straightforward enough. But what happens if we count the votes
          differently?
        </p>
      </Container>
    </Chapter>
  );
}
