import type { PreferenceProfile, Candidate, Ranking, VotingResult } from "./types";

function tallyFirstPlaceVotes(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Record<string, number> {
  const votes: Record<string, number> = {};
  for (const candidate of candidates) {
    votes[candidate] = 0;
  }
  for (const ranking of profile) {
    if (ranking.length > 0) {
      const top = ranking[0]!;
      votes[top] = (votes[top] ?? 0) + 1;
    }
  }
  return votes;
}

function averagePosition(
  profile: PreferenceProfile,
  candidate: Candidate
): number {
  if (profile.length === 0) return 0;
  let total = 0;
  for (const ranking of profile) {
    const idx = ranking.indexOf(candidate);
    total += idx === -1 ? ranking.length : idx;
  }
  return total / profile.length;
}

function rankByVotes(
  votes: Record<string, number>,
  candidates: Candidate[],
  profile: PreferenceProfile
): Ranking {
  return [...candidates].sort((a, b) => {
    const diff = votes[b]! - votes[a]!;
    if (diff !== 0) return diff;
    const posDiff = averagePosition(profile, a) - averagePosition(profile, b);
    if (posDiff !== 0) return posDiff;
    return a.localeCompare(b);
  });
}

export function plurality(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Ranking {
  if (candidates.length === 0) return [];
  const votes = tallyFirstPlaceVotes(profile, candidates);
  return rankByVotes(votes, candidates, profile);
}

export function pluralityWithDetails(
  profile: PreferenceProfile,
  candidates: Candidate[]
): VotingResult {
  if (candidates.length === 0) return { ranking: [], details: {} };
  const votes = tallyFirstPlaceVotes(profile, candidates);
  return {
    ranking: rankByVotes(votes, candidates, profile),
    details: votes,
  };
}
