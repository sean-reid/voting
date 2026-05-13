import type { PreferenceProfile, Candidate, Ranking, VotingResult } from "./types";

function tallyApprovals(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Record<string, number> {
  const approvalThreshold = Math.ceil(candidates.length / 2);
  const approvals: Record<string, number> = {};
  for (const candidate of candidates) {
    approvals[candidate] = 0;
  }

  for (const ranking of profile) {
    const approved = ranking.slice(0, approvalThreshold);
    for (const candidate of approved) {
      if (candidate in approvals) {
        approvals[candidate]! += 1;
      }
    }
  }

  return approvals;
}

function rankByApprovals(
  approvals: Record<string, number>,
  candidates: Candidate[]
): Ranking {
  return [...candidates].sort((a, b) => {
    const diff = approvals[b]! - approvals[a]!;
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });
}

export function approval(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Ranking {
  if (candidates.length === 0) return [];
  const approvals = tallyApprovals(profile, candidates);
  return rankByApprovals(approvals, candidates);
}

export function approvalWithDetails(
  profile: PreferenceProfile,
  candidates: Candidate[]
): VotingResult {
  if (candidates.length === 0) return { ranking: [], details: {} };
  const approvals = tallyApprovals(profile, candidates);
  const ranking = rankByApprovals(approvals, candidates);
  const maxApprovals = approvals[ranking[0]!] ?? 0;
  const tiedWinners = ranking.filter((c) => approvals[c] === maxApprovals);
  return {
    ranking,
    details: approvals,
    tiedWinners: tiedWinners.length > 1 ? tiedWinners : undefined,
  };
}
