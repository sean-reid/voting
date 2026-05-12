import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import PreferenceOrdering from "@/components/interactive/PreferenceOrdering";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const CANDIDATES = ["A", "B", "C"];

const INITIAL_VOTERS = [
  ["A", "B", "C"],
  ["B", "C", "A"],
  ["C", "A", "B"],
];

const ALL_ORDERINGS = [
  ["A", "B", "C"],
  ["A", "C", "B"],
  ["B", "A", "C"],
  ["B", "C", "A"],
  ["C", "A", "B"],
  ["C", "B", "A"],
];

function detectDictator(
  voters: string[][],
  groupRanking: string[]
): number | null {
  for (let v = 0; v < voters.length; v++) {
    const voterRanking = voters[v]!;
    const matches = voterRanking.every((c, i) => groupRanking[i] === c);
    if (matches) {
      const othersDisagree = voters.some(
        (other, oi) =>
          oi !== v && other.some((c, i) => groupRanking[i] !== c)
      );
      if (othersDisagree) return v;
    }
  }
  return null;
}

export default function DictatorDetector() {
  const [voters, setVoters] = useState(INITIAL_VOTERS);
  const [, setDictatorIndex] = useState<number | null>(null);
  const [groupRanking, setGroupRanking] = useState<string[]>(CANDIDATES);
  const [checked, setChecked] = useState(false);

  function updateVoter(index: number, newRanking: string[]) {
    setVoters((prev) => prev.map((r, i) => (i === index ? newRanking : r)));
    setChecked(false);
    setDictatorIndex(null);
  }

  function updateGroup(newRanking: string[]) {
    setGroupRanking(newRanking);
    setChecked(false);
    setDictatorIndex(null);
  }

  const checkResult = useMemo(() => {
    if (!checked) return null;
    return detectDictator(voters, groupRanking);
  }, [checked, voters, groupRanking]);

  function handleCheck() {
    setDictatorIndex(detectDictator(voters, groupRanking));
    setChecked(true);
  }

  const demoCountRef = useRef(0);

  function setDictatorMode(voterIndex: number) {
    const pick = demoCountRef.current % ALL_ORDERINGS.length;
    demoCountRef.current += 1;
    const dictatorOrdering = ALL_ORDERINGS[pick]!;
    const otherOptions = ALL_ORDERINGS.filter(
      (o) => o.join() !== dictatorOrdering.join()
    );
    const newVoters = voters.map((_v, i) => {
      if (i === voterIndex) return [...dictatorOrdering];
      return [...otherOptions[(i + pick) % otherOptions.length]!];
    });
    setVoters(newVoters);
    setGroupRanking([...dictatorOrdering]);
    setDictatorIndex(voterIndex);
    setChecked(true);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-3">
        {voters.map((ranking, i) => (
          <PreferenceOrdering
            key={i}
            candidates={CANDIDATES}
            ranking={ranking}
            onChange={(r) => updateVoter(i, r)}
            label={`Voter ${i + 1}`}
          />
        ))}
      </div>

      <Card>
        <div className="space-y-3">
          <p className="text-sm font-medium text-ink-secondary">
            Group ranking (set this to the social outcome)
          </p>
          <PreferenceOrdering
            candidates={CANDIDATES}
            ranking={groupRanking}
            onChange={updateGroup}
            label="Group result"
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheck}
          className="inline-flex items-center rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
        >
          Check for dictator
        </button>
        <div className="flex gap-2">
          {voters.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDictatorMode(i)}
              className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-hover"
            >
              Make Voter {i + 1} dictator
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            {checkResult !== null ? (
              <div className="rounded-lg border border-muted-red/30 bg-muted-red/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge variant="muted-red">Dictator found</Badge>
                  <span className="text-sm text-muted-red-dark">
                    Voter {checkResult + 1}'s preference is always the group
                    outcome, regardless of what the others want.
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-sage/30 bg-sage/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge variant="sage">No dictator</Badge>
                  <span className="text-sm text-sage-dark">
                    No single voter's preference fully determines the group
                    ranking here.
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
