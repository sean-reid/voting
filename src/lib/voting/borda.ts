import type { PreferenceProfile, Candidate, Ranking, VotingResult } from "./types";

function tallyBordaScores(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Record<string, number> {
  const n = candidates.length;
  const scores: Record<string, number> = {};
  for (const candidate of candidates) {
    scores[candidate] = 0;
  }
  for (const ranking of profile) {
    for (let i = 0; i < ranking.length; i++) {
      const candidate = ranking[i]!;
      if (candidate in scores) {
        scores[candidate] = (scores[candidate] ?? 0) + (n - 1 - i);
      }
    }
  }
  return scores;
}

function rankByScores(
  scores: Record<string, number>,
  candidates: Candidate[]
): Ranking {
  return [...candidates].sort((a, b) => {
    const diff = scores[b]! - scores[a]!;
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });
}

export function borda(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Ranking {
  if (candidates.length === 0) return [];
  const scores = tallyBordaScores(profile, candidates);
  return rankByScores(scores, candidates);
}

export function bordaWithDetails(
  profile: PreferenceProfile,
  candidates: Candidate[]
): VotingResult {
  if (candidates.length === 0) return { ranking: [], details: {} };
  const scores = tallyBordaScores(profile, candidates);
  const ranking = rankByScores(scores, candidates);
  const maxScore = scores[ranking[0]!] ?? 0;
  const tiedWinners = ranking.filter((c) => scores[c] === maxScore);
  return {
    ranking,
    details: scores,
    tiedWinners: tiedWinners.length > 1 ? tiedWinners : undefined,
  };
}
