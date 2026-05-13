import type { SocialWelfareFunction, Candidate, Ranking, PreferenceProfile } from "../voting/types";
import type { CriterionResult } from "./types";
import { permutations } from "../permutations";

function indexOf(ranking: Ranking, candidate: Candidate): number {
  return ranking.indexOf(candidate);
}

function ranksAbove(ranking: Ranking, a: Candidate, b: Candidate): boolean {
  return indexOf(ranking, a) < indexOf(ranking, b);
}

function generateProfiles(allRankings: Ranking[], voterCount: number): PreferenceProfile[] {
  if (voterCount === 0) return [[]];
  const subProfiles = generateProfiles(allRankings, voterCount - 1);
  const result: PreferenceProfile[] = [];
  for (const ranking of allRankings) {
    for (const sub of subProfiles) {
      result.push([ranking, ...sub]);
    }
  }
  return result;
}

export function checkPareto(
  swf: SocialWelfareFunction,
  candidates: Candidate[]
): CriterionResult {
  const allRankings = permutations(candidates);
  const voterCount = Math.min(3, candidates.length);

  const profiles = candidates.length <= 3 && voterCount <= 3
    ? generateProfiles(allRankings, voterCount)
    : generateSampledProfiles(allRankings, voterCount, 200);

  for (const profile of profiles) {
    const result = swf(profile, candidates);
    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const a = candidates[i]!;
        const b = candidates[j]!;

        const allPreferAOverB = profile.every(r => ranksAbove(r, a, b));
        if (allPreferAOverB && !ranksAbove(result, a, b)) {
          return {
            satisfied: false,
            counterexample: {
              description: `All voters rank ${a} above ${b}, but the group ranking does not`,
              profile,
              result,
            },
          };
        }

        const allPreferBOverA = profile.every(r => ranksAbove(r, b, a));
        if (allPreferBOverA && !ranksAbove(result, b, a)) {
          return {
            satisfied: false,
            counterexample: {
              description: `All voters rank ${b} above ${a}, but the group ranking does not`,
              profile,
              result,
            },
          };
        }
      }
    }
  }

  return { satisfied: true };
}

function generateSampledProfiles(
  allRankings: Ranking[],
  voterCount: number,
  sampleSize: number
): PreferenceProfile[] {
  const profiles: PreferenceProfile[] = [];
  for (let i = 0; i < sampleSize; i++) {
    const profile: PreferenceProfile = [];
    for (let v = 0; v < voterCount; v++) {
      profile.push(allRankings[Math.floor(Math.random() * allRankings.length)]!);
    }
    profiles.push(profile);
  }
  return profiles;
}
