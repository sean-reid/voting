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

    const total = profile.length;
    let majorityWinner: string | null = null;
    for (const c of remaining) {
      if (votes[c]! > total / 2) {
        majorityWinner = c;
        break;
      }
    }

    if (majorityWinner !== null) {
      const losers = [...remaining]
        .filter((c) => c !== majorityWinner)
        .sort((a, b) => (votes[a] ?? 0) - (votes[b] ?? 0));
      for (const l of losers) eliminationOrder.push(l);
      eliminationOrder.push(majorityWinner);
      return eliminationOrder.reverse();
    }

    let minVotes = Infinity;
    for (const c of remaining) {
      if (votes[c]! < minVotes) {
        minVotes = votes[c]!;
      }
    }

    const lastPlace = [...remaining].filter((c) => votes[c]! === minVotes);

    if (lastPlace.length === remaining.size) {
      const sorted = lastPlace.sort((a, b) => (votes[b] ?? 0) - (votes[a] ?? 0));
      for (const c of sorted) eliminationOrder.push(c);
      return eliminationOrder.reverse();
    }

    const eliminated = lastPlace[lastPlace.length - 1]!;
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

    const total = profile.length;
    let majorityWinner: string | null = null;
    for (const c of remaining) {
      if (votes[c]! > total / 2) {
        majorityWinner = c;
        break;
      }
    }

    if (majorityWinner !== null) {
      const losers = [...remaining]
        .filter((c) => c !== majorityWinner)
        .sort((a, b) => (votes[a] ?? 0) - (votes[b] ?? 0));
      for (const l of losers) eliminationOrder.push(l);
      eliminationOrder.push(majorityWinner);
      break;
    }

    let minVotes = Infinity;
    for (const c of remaining) {
      if (votes[c]! < minVotes) {
        minVotes = votes[c]!;
      }
    }

    const lastPlace = [...remaining].filter((c) => votes[c]! === minVotes);

    if (lastPlace.length === remaining.size) {
      const sorted = lastPlace.sort((a, b) => (votes[b] ?? 0) - (votes[a] ?? 0));
      for (const c of sorted) eliminationOrder.push(c);
      break;
    }

    const eliminated = lastPlace[lastPlace.length - 1]!;
    remaining.delete(eliminated);
    eliminationOrder.push(eliminated);
  }

  const details: Record<string, number> = {};
  for (const candidate of candidates) {
    details[candidate] = finalVotes[candidate] ?? 0;
  }

  const ranking = eliminationOrder.reverse();
  const topScore = details[ranking[0]!] ?? 0;
  const tiedWinners = ranking.filter((c) => details[c] === topScore);
  return {
    ranking,
    details,
    tiedWinners: tiedWinners.length > 1 ? tiedWinners : undefined,
  };
}
