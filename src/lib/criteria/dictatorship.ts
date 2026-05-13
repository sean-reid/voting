import type { SocialWelfareFunction, Candidate, Ranking, PreferenceProfile } from "../voting/types";
import type { CriterionResult } from "./types";
import { permutations } from "../permutations";

function rankingsEqual(a: Ranking, b: Ranking): boolean {
  if (a.length !== b.length) return false;
  return a.every((c, i) => c === b[i]);
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

export function checkNonDictatorship(
  swf: SocialWelfareFunction,
  candidates: Candidate[]
): CriterionResult {
  const allRankings = permutations(candidates);
  const voterCount = 3;

  const canEnumerate = allRankings.length ** voterCount <= 216;

  const profiles = canEnumerate
    ? generateProfiles(allRankings, voterCount)
    : sampleProfiles(allRankings, voterCount, 200);

  const results = profiles.map(p => swf(p, candidates));

  for (let voter = 0; voter < voterCount; voter++) {
    let isDictator = true;
    for (let p = 0; p < profiles.length; p++) {
      if (!rankingsEqual(profiles[p]![voter]!, results[p]!)) {
        isDictator = false;
        break;
      }
    }
    if (isDictator) {
      return {
        satisfied: false,
        counterexample: {
          description: `Voter ${voter + 1} is a dictator: the group ranking always matches theirs`,
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
