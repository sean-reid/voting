import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type {
  Candidate,
  Ranking,
  PreferenceProfile,
  SocialWelfareFunction,
} from "@/lib/voting/types";
import { checkPareto } from "@/lib/criteria/pareto";
import { checkIIA } from "@/lib/criteria/iia";
import { checkUnrestrictedDomain } from "@/lib/criteria/unrestricted";
import { checkNonDictatorship } from "@/lib/criteria/dictatorship";
import { plurality } from "@/lib/voting/plurality";
import { borda } from "@/lib/voting/borda";
import { irv } from "@/lib/voting/irv";
import { condorcet } from "@/lib/voting/condorcet";
import type { CriterionResult } from "@/lib/criteria/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { permutations } from "@/lib/permutations";

const CANDIDATES: Candidate[] = ["A", "B", "C"];

const CANDIDATE_COLORS: Record<string, string> = {
  A: "bg-candidate-a text-white",
  B: "bg-candidate-b text-white",
  C: "bg-candidate-c text-white",
};

const CANDIDATE_BORDER_COLORS: Record<string, string> = {
  A: "border-candidate-a",
  B: "border-candidate-b",
  C: "border-candidate-c",
};

interface ProfileScenario {
  label: string;
  description: string;
  profile: PreferenceProfile;
}

const SCENARIOS: ProfileScenario[] = [
  {
    label: "Unanimous",
    description: "All voters agree completely",
    profile: [
      ["A", "B", "C"],
      ["A", "B", "C"],
      ["A", "B", "C"],
    ],
  },
  {
    label: "Classic Cycle",
    description: "A Condorcet cycle with no clear winner",
    profile: [
      ["A", "B", "C"],
      ["B", "C", "A"],
      ["C", "A", "B"],
    ],
  },
  {
    label: "Split Top",
    description: "Two voters agree on 1st, disagree on rest",
    profile: [
      ["A", "B", "C"],
      ["A", "C", "B"],
      ["B", "C", "A"],
    ],
  },
  {
    label: "Near Consensus",
    description: "Two agree, one strongly dissents",
    profile: [
      ["A", "B", "C"],
      ["A", "B", "C"],
      ["C", "B", "A"],
    ],
  },
  {
    label: "Reversed Pair",
    description: "Two voters are mirror images",
    profile: [
      ["A", "B", "C"],
      ["C", "B", "A"],
      ["B", "A", "C"],
    ],
  },
  {
    label: "Middle Squeeze",
    description: "B is everyone's 2nd but nobody's 1st",
    profile: [
      ["A", "B", "C"],
      ["C", "B", "A"],
      ["A", "B", "C"],
    ],
  },
  {
    label: "Anti-Cycle",
    description: "The reverse of the classic cycle",
    profile: [
      ["C", "B", "A"],
      ["A", "C", "B"],
      ["B", "A", "C"],
    ],
  },
  {
    label: "Polarized",
    description: "Extreme disagreement on A",
    profile: [
      ["A", "C", "B"],
      ["B", "A", "C"],
      ["C", "B", "A"],
    ],
  },
];

type PresetKey = "plurality" | "borda" | "irv" | "condorcet";

interface PresetDef {
  key: PresetKey;
  label: string;
  method: SocialWelfareFunction;
}

const PRESETS: PresetDef[] = [
  { key: "plurality", label: "Plurality", method: plurality },
  { key: "borda", label: "Borda Count", method: borda },
  { key: "irv", label: "Instant Runoff", method: irv },
  { key: "condorcet", label: "Condorcet", method: condorcet },
];

const ALL_RANKINGS = permutations(CANDIDATES);

interface CriterionDisplay {
  key: string;
  name: string;
  shortDescription: string;
  check: (swf: SocialWelfareFunction, candidates: Candidate[]) => CriterionResult;
}

const CRITERIA: CriterionDisplay[] = [
  {
    key: "unrestricted",
    name: "Unrestricted Domain",
    shortDescription: "The rule must handle every possible set of voter preferences and produce a valid ranking.",
    check: checkUnrestrictedDomain,
  },
  {
    key: "pareto",
    name: "Pareto Efficiency",
    shortDescription: "If every voter prefers X to Y, the group ranking must also prefer X to Y.",
    check: checkPareto,
  },
  {
    key: "iia",
    name: "Independence of Irrelevant Alternatives",
    shortDescription: "The group's ranking of X vs Y depends only on each voter's ranking of X vs Y.",
    check: checkIIA,
  },
  {
    key: "dictatorship",
    name: "Non-Dictatorship",
    shortDescription: "No single voter can determine the group ranking for every possible set of preferences.",
    check: checkNonDictatorship,
  },
];

function profileKey(profile: PreferenceProfile): string {
  return profile.map((r) => r.join("")).join("|");
}

function rankingLabel(ranking: Ranking): string {
  return ranking.join(" > ");
}

function CandidatePill({ candidate }: { candidate: Candidate }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${CANDIDATE_COLORS[candidate] ?? "bg-surface-hover text-ink"}`}
      aria-label={`Candidate ${candidate}`}
    >
      {candidate}
    </span>
  );
}

function RankingPills({ ranking }: { ranking: Ranking }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {ranking.map((candidate, i) => (
        <div key={candidate} className="flex items-center gap-1">
          <CandidatePill candidate={candidate} />
          {i < ranking.length - 1 && (
            <span className="text-ink-tertiary text-xs select-none" aria-hidden="true">
              {"›"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function RankingSelector({
  value,
  onChange,
  profileIndex,
}: {
  value: Ranking | null;
  onChange: (ranking: Ranking) => void;
  profileIndex: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (ranking: Ranking) => {
      onChange(ranking);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, ranking: Ranking) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(ranking);
      }
    },
    [handleSelect]
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-150 w-full ${
          value
            ? `${CANDIDATE_BORDER_COLORS[value[0]!] ?? "border-border"} bg-paper hover:bg-surface-hover`
            : "border-dashed border-border-strong bg-surface hover:bg-surface-hover"
        }`}
        aria-label={`Select group ranking for profile ${profileIndex + 1}. ${value ? `Currently ${rankingLabel(value)}` : "Not yet selected"}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {value ? (
          <RankingPills ranking={value} />
        ) : (
          <span className="text-ink-tertiary italic">Choose ranking...</span>
        )}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-auto text-ink-tertiary transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M4 6 L8 10 L12 6" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-paper shadow-lg overflow-hidden"
            role="listbox"
            aria-label="Available rankings"
          >
            {ALL_RANKINGS.map((ranking) => {
              const isSelected =
                value !== null && ranking.every((c, i) => c === value[i]);
              return (
                <div
                  key={ranking.join("")}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => handleSelect(ranking)}
                  onKeyDown={(e) => handleKeyDown(e, ranking)}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors duration-100 ${
                    isSelected
                      ? "bg-terracotta/10"
                      : "hover:bg-surface-hover"
                  }`}
                >
                  <RankingPills ranking={ranking} />
                  {isSelected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-auto text-terracotta shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M3 8.5 L6.5 12 L13 4" />
                    </svg>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.5 L7.5 13 L14 5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 4.5 L13.5 13.5 M13.5 4.5 L4.5 13.5" />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" strokeDasharray="4 3" />
    </svg>
  );
}

function formatCounterexample(result: CriterionResult): string | null {
  if (result.satisfied || !result.counterexample) return null;
  const ce = result.counterexample;
  let text = ce.description;
  if (ce.profile) {
    const voterDescriptions = ce.profile
      .map((r, i) => `Voter ${i + 1}: ${r.join(" > ")}`)
      .join("; ");
    text += `. Voters: ${voterDescriptions}`;
  }
  if (ce.result) {
    text += `. Result: ${ce.result.join(" > ")}`;
  }
  if (ce.profile2) {
    const voterDescriptions2 = ce.profile2
      .map((r, i) => `Voter ${i + 1}: ${r.join(" > ")}`)
      .join("; ");
    text += `. Alternate profile: ${voterDescriptions2}`;
  }
  if (ce.result2) {
    text += `. Alternate result: ${ce.result2.join(" > ")}`;
  }
  return text;
}

function CriterionCard({
  criterion,
  result,
  index,
  isReady,
}: {
  criterion: CriterionDisplay;
  result: CriterionResult | null;
  index: number;
  isReady: boolean;
}) {
  const status = !isReady ? "pending" : result?.satisfied ? "satisfied" : "violated";
  const counterexample = result ? formatCounterexample(result) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: "easeOut",
        layout: { duration: 0.3 },
      }}
      className="bg-surface border border-border rounded-xl p-5 space-y-3"
      role="listitem"
      aria-label={`${criterion.name}: ${status}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-sm font-semibold text-ink leading-snug">
          {criterion.name}
        </h3>
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-1 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "satisfied"
                ? "bg-sage/15 text-sage"
                : status === "violated"
                  ? "bg-muted-red/15 text-muted-red"
                  : "bg-surface-hover text-ink-tertiary"
            }`}
          >
            {status === "satisfied" && <CheckIcon />}
            {status === "violated" && <XIcon />}
            {status === "pending" && <PendingIcon />}
            <span>
              {status === "satisfied"
                ? "Passed"
                : status === "violated"
                  ? "Violated"
                  : "Waiting"}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="text-xs text-ink-secondary leading-relaxed">
        {criterion.shortDescription}
      </p>
      <AnimatePresence>
        {status === "violated" && counterexample && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-md bg-muted-red/5 border border-muted-red/20 px-3 py-2">
              <p className="text-xs text-muted-red-dark leading-relaxed">
                {counterexample}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProfileCard({
  scenario,
  index,
  selectedRanking,
  onSelectRanking,
}: {
  scenario: ProfileScenario;
  index: number;
  selectedRanking: Ranking | null;
  onSelectRanking: (ranking: Ranking) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className="h-full"
    >
      <Card hover className="!p-4 h-full">
        <div className="space-y-3 h-full flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-serif text-sm font-semibold text-ink leading-snug">
                {scenario.label}
              </h3>
              <p className="text-xs text-ink-tertiary mt-0.5 leading-snug">
                {scenario.description}
              </p>
            </div>
            {selectedRanking ? (
              <Badge variant="sage">Set</Badge>
            ) : (
              <Badge variant="default">Open</Badge>
            )}
          </div>

          <div
            className="space-y-1.5"
            role="list"
            aria-label={`Voter preferences for ${scenario.label}`}
          >
            {scenario.profile.map((voterRanking, voterIndex) => (
              <div
                key={voterIndex}
                className="flex items-center gap-2"
                role="listitem"
                aria-label={`Voter ${voterIndex + 1}: ${rankingLabel(voterRanking)}`}
              >
                <span className="text-xs font-medium text-ink-tertiary w-12 shrink-0">
                  Voter {voterIndex + 1}
                </span>
                <RankingPills ranking={voterRanking} />
              </div>
            ))}
          </div>

          <div className="pt-1 border-t border-border mt-auto">
            <p className="text-xs font-medium text-ink-secondary mb-2">
              Group outcome
            </p>
            <RankingSelector
              value={selectedRanking}
              onChange={onSelectRanking}
              profileIndex={index}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ProgressBar({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? (filled / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-secondary font-medium">
          {filled} of {total} profiles decided
        </span>
        <span className="text-ink-tertiary tabular-nums">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-terracotta"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function ImpossibilitySandbox() {
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);
  const [userRankings, setUserRankings] = useState<Record<string, Ranking>>({});

  const handlePreset = useCallback(
    (preset: PresetDef) => {
      const newRankings: Record<string, Ranking> = {};
      for (const scenario of SCENARIOS) {
        const key = profileKey(scenario.profile);
        newRankings[key] = preset.method(scenario.profile, CANDIDATES);
      }
      setUserRankings(newRankings);
      setActivePreset(preset.key);
    },
    []
  );

  const handleSetRanking = useCallback(
    (scenarioProfile: PreferenceProfile, ranking: Ranking) => {
      const key = profileKey(scenarioProfile);
      setUserRankings((prev) => ({ ...prev, [key]: ranking }));
      setActivePreset(null);
    },
    []
  );

  const filledCount = SCENARIOS.filter(
    (s) => userRankings[profileKey(s.profile)] !== undefined
  ).length;

  const allFilled = filledCount === SCENARIOS.length;

  const swf: SocialWelfareFunction | null = useMemo(() => {
    if (!allFilled) return null;

    const lookupTable: Record<string, Ranking> = {};

    for (const [key, ranking] of Object.entries(userRankings)) {
      lookupTable[key] = ranking;
    }

    const baseMethod = findClosestPreset(userRankings);

    return (profile: PreferenceProfile, candidates: Candidate[]): Ranking => {
      const key = profileKey(profile);
      if (lookupTable[key]) return lookupTable[key];
      return baseMethod(profile, candidates);
    };
  }, [allFilled, userRankings]);

  const criteriaResults = useMemo(() => {
    if (!swf) return null;
    return CRITERIA.map((c) => ({
      criterion: c,
      result: c.check(swf, CANDIDATES),
    }));
  }, [swf]);

  const violationCount = criteriaResults
    ? criteriaResults.filter((r) => !r.result.satisfied).length
    : 0;

  return (
    <div className="space-y-8" role="region" aria-label="Impossibility Theorem Sandbox">
      <div className="space-y-3">
        <p className="text-sm text-ink-secondary leading-relaxed max-w-2xl">
          Arrow's Impossibility Theorem says no voting rule for 3+ candidates can satisfy
          all four fairness criteria at once. Try it yourself: pick a preset method or
          define your own group rankings, then watch the criteria light up.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">
          Start with a method
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Preset voting methods">
          {PRESETS.map((preset) => (
            <Button
              key={preset.key}
              variant={activePreset === preset.key ? "primary" : "secondary"}
              onClick={() => handlePreset(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <ProgressBar filled={filledCount} total={SCENARIOS.length} />

      <div className="space-y-3">
        <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">
          Preference profiles
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCENARIOS.map((scenario, index) => (
            <ProfileCard
              key={scenario.label}
              scenario={scenario}
              index={index}
              selectedRanking={userRankings[profileKey(scenario.profile)] ?? null}
              onSelectRanking={(ranking) =>
                handleSetRanking(scenario.profile, ranking)
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">
            Arrow's criteria
          </p>
          <AnimatePresence>
            {criteriaResults && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25 }}
              >
                {violationCount > 0 ? (
                  <Badge variant="muted-red">
                    {violationCount} violated
                  </Badge>
                ) : (
                  <Badge variant="sage">All satisfied</Badge>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          role="list"
          aria-label="Fairness criteria results"
        >
          {CRITERIA.map((criterion, index) => (
            <CriterionCard
              key={criterion.key}
              criterion={criterion}
              result={
                criteriaResults
                  ? criteriaResults.find((r) => r.criterion.key === criterion.key)
                      ?.result ?? null
                  : null
              }
              index={index}
              isReady={allFilled}
            />
          ))}
        </div>

        <AnimatePresence>
          {!allFilled && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-ink-tertiary text-center py-2"
            >
              Set all {SCENARIOS.length} group rankings to check criteria, or
              click a preset above to fill them in automatically.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {criteriaResults && violationCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-lg border border-terracotta/30 bg-terracotta/5 px-4 py-3"
              role="alert"
            >
              <p className="text-sm text-terracotta-dark leading-relaxed">
                <span className="font-semibold">Arrow's theorem confirmed.</span>{" "}
                No matter how you assign group rankings, at least one criterion
                will always break. This is not a flaw in any particular rule. It
                is a mathematical impossibility.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function findClosestPreset(
  userRankings: Record<string, Ranking>
): SocialWelfareFunction {
  const methods = [plurality, borda, irv];
  let bestMethod = plurality;
  let bestScore = -1;

  for (const method of methods) {
    let score = 0;
    for (const scenario of SCENARIOS) {
      const key = profileKey(scenario.profile);
      const userRanking = userRankings[key];
      if (!userRanking) continue;
      const methodRanking = method(scenario.profile, CANDIDATES);
      if (methodRanking.every((c, i) => c === userRanking[i])) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMethod = method;
    }
  }

  return bestMethod;
}
