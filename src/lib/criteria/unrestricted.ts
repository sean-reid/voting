import type { SocialWelfareFunction, Candidate, Ranking, PreferenceProfile } from "../voting/types";
import type { CriterionResult } from "./types";
import { permutations } from "../permutations";

function isValidRanking(ranking: Ranking, candidates: Candidate[]): boolean {
  if (ranking.length !== candidates.length) return false;
  const sorted = [...ranking].sort();
  const expected = [...candidates].sort();
  return sorted.every((c, i) => c === expected[i]);
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

export function checkUnrestrictedDomain(
  swf: SocialWelfareFunction,
  candidates: Candidate[]
): CriterionResult {
  const allRankings = permutations(candidates);
  const voterCount = 3;

  const canEnumerate = allRankings.length ** voterCount <= 216;

  const profiles = canEnumerate
    ? generateProfiles(allRankings, voterCount)
    : sampleProfiles(allRankings, voterCount, 200);

  for (const profile of profiles) {
    try {
      const result = swf(profile, candidates);
      if (!isValidRanking(result, candidates)) {
        return {
          satisfied: false,
          counterexample: {
            description: `Returned an invalid ranking: [${result.join(", ")}]`,
            profile,
            result,
          },
        };
      }
    } catch {
      return {
        satisfied: false,
        counterexample: {
          description: `Crashed on this profile`,
          profile,
        },
      };
    }
  }

  return { satisfied: true };
}

function sampleProfiles(
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
