import type { PreferenceProfile, Candidate, Ranking, VotingResult } from "./types";

function countFirstPlace(
  profile: PreferenceProfile,
  remaining: Set<string>
): Record<string, number> {
  const votes: Record<string, number> = {};
  for (const candidate of remaining) {
    votes[candidate] = 0;
  }
  for (const ranking of profile) {
    const topChoice = ranking.find((c) => remaining.has(c));
    if (topChoice !== undefined) {
      votes[topChoice]! += 1;
    }
  }
  return votes;
}

export function irv(
  profile: PreferenceProfile,
  candidates: Candidate[]
): Ranking {
  if (candidates.length === 0) return [];
  if (candidates.length === 1) return [...candidates];

  const remaining = new Set(candidates);
  const eliminationOrder: string[] = [];

  while (remaining.size > 1) {
    const votes = countFirstPlace(profile, remaining);

    let minVotes = Infinity;
    for (const c of remaining) {
      if (votes[c]! < minVotes) {
        minVotes = votes[c]!;
      }
    }

    const tied = [...remaining]
      .filter((c) => votes[c]! === minVotes)
      .sort((a, b) => a.localeCompare(b));

    const eliminated = tied[tied.length - 1]!;
    remaining.delete(eliminated);
    eliminationOrder.push(eliminated);
  }

  const winner = [...remaining][0]!;
  eliminationOrder.push(winner);

  return eliminationOrder.reverse();
}

export function irvWithDetails(
  profile: PreferenceProfile,
  candidates: Candidate[]
): VotingResult {
  if (candidates.length === 0) return { ranking: [], details: {} };
  if (candidates.length === 1) {
    return {
      ranking: [...candidates],
      details: { [candidates[0]!]: profile.length },
    };
  }

  const remaining = new Set(candidates);
  const eliminationOrder: string[] = [];
  let finalVotes: Record<string, number> = {};

  while (remaining.size > 1) {
    const votes = countFirstPlace(profile, remaining);
    finalVotes = votes;

    let minVotes = Infinity;
    for (const c of remaining) {
      if (votes[c]! < minVotes) {
        minVotes = votes[c]!;
      }
    }

    const tied = [...remaining]
      .filter((c) => votes[c]! === minVotes)
      .sort((a, b) => a.localeCompare(b));

    const eliminated = tied[tied.length - 1]!;
    remaining.delete(eliminated);
    eliminationOrder.push(eliminated);
  }

  const winner = [...remaining][0]!;
  eliminationOrder.push(winner);

  const details: Record<string, number> = {};
  for (const candidate of candidates) {
    details[candidate] = finalVotes[candidate] ?? 0;
  }
  if (winner in finalVotes) {
    details[winner] = finalVotes[winner]!;
  } else {
    details[winner] = profile.length;
  }

  return {
    ranking: eliminationOrder.reverse(),
    details,
  };
}
