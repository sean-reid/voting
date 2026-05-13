import type { SocialWelfareFunction, Candidate, Ranking, PreferenceProfile } from "../voting/types";
import type { CriterionResult } from "./types";
import { permutations } from "../permutations";

function ranksAbove(ranking: Ranking, a: Candidate, b: Candidate): boolean {
  return ranking.indexOf(a) < ranking.indexOf(b);
}

function pairwiseAgreement(
  profile1: PreferenceProfile,
  profile2: PreferenceProfile,
  a: Candidate,
  b: Candidate
): boolean {
  if (profile1.length !== profile2.length) return false;
  for (let i = 0; i < profile1.length; i++) {
    if (ranksAbove(profile1[i]!, a, b) !== ranksAbove(profile2[i]!, a, b)) {
      return false;
    }
  }
  return true;
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

export function checkIIA(
  swf: SocialWelfareFunction,
  candidates: Candidate[]
): CriterionResult {
  const allRankings = permutations(candidates);
  const voterCount = 3;

  const canEnumerate = allRankings.length ** voterCount <= 216;

  const profiles = canEnumerate
    ? generateProfiles(allRankings, voterCount)
    : sampleProfiles(allRankings, voterCount, 300);

  const results = profiles.map(p => swf(p, candidates));

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const a = candidates[i]!;
      const b = candidates[j]!;

      for (let p1 = 0; p1 < profiles.length; p1++) {
        for (let p2 = p1 + 1; p2 < profiles.length; p2++) {
          if (!pairwiseAgreement(profiles[p1]!, profiles[p2]!, a, b)) continue;

          const r1ab = ranksAbove(results[p1]!, a, b);
          const r2ab = ranksAbove(results[p2]!, a, b);

          if (r1ab !== r2ab) {
            return {
              satisfied: false,
              counterexample: {
                description: `All voters rank ${a} vs ${b} the same in both profiles, but the group ranking disagrees`,
                profile: profiles[p1]!,
                profile2: profiles[p2]!,
                result: results[p1]!,
                result2: results[p2]!,
              },
            };
          }
        }
      }
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
