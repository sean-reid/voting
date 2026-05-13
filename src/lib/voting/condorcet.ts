import type { PreferenceProfile, Candidate, Ranking, VotingResult } from "./types";

function buildPairwiseMatrix(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {};
  for (const a of candidates) {
    matrix[a] = {};
    for (const b of candidates) {
      matrix[a]![b] = 0;
    }
  }

  for (const ranking of profile) {
    for (let i = 0; i < ranking.length; i++) {
      for (let j = i + 1; j < ranking.length; j++) {
        const preferred = ranking[i]!;
        const lessPreferred = ranking[j]!;
        if (preferred in matrix && lessPreferred in matrix) {
          matrix[preferred]![lessPreferred]! += 1;
        }
      }
    }
  }

  return matrix;
}

function countPairwiseWins(
  matrix: Record<string, Record<string, number>>,
  candidates: Candidate[]
): Record<string, number> {
  const wins: Record<string, number> = {};
  for (const candidate of candidates) {
    wins[candidate] = 0;
  }

  for (const a of candidates) {
    for (const b of candidates) {
      if (a !== b && matrix[a]![b]! > matrix[b]![a]!) {
        wins[a]! += 1;
      }
    }
  }

  return wins;
}

export function condorcet(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Ranking {
  if (candidates.length === 0) return [];
  if (candidates.length === 1) return [...candidates];

  const matrix = buildPairwiseMatrix(profile, candidates);
  const wins = countPairwiseWins(matrix, candidates);

  return [...candidates].sort((a, b) => {
    const diff = wins[b]! - wins[a]!;
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });
}

export function condorcetWithDetails(
  profile: PreferenceProfile,
  candidates: Candidate[]
): VotingResult {
  if (candidates.length === 0) return { ranking: [], details: {} };
  if (candidates.length === 1) {
    return { ranking: [...candidates], details: { [candidates[0]!]: 0 } };
  }

  const matrix = buildPairwiseMatrix(profile, candidates);
  const wins = countPairwiseWins(matrix, candidates);

  const ranking = [...candidates].sort((a, b) => {
    const diff = wins[b]! - wins[a]!;
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });

  const topWins = wins[ranking[0]!] ?? 0;
  const tiedWinners = ranking.filter((c) => wins[c] === topWins);
  return {
    ranking,
    details: wins,
    tiedWinners: tiedWinners.length > 1 ? tiedWinners : undefined,
  };
}
