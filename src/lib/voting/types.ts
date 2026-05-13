export type Candidate = string;

export type Ranking = Candidate[];

export type PreferenceProfile = Ranking[];

export type VotingMethod = (profile: PreferenceProfile, candidates: Candidate[]) => Ranking;

export type SocialWelfareFunction = (profile: PreferenceProfile, candidates: Candidate[]) => Ranking;

export interface VotingResult {
  ranking: Ranking;
  details: Record<string, number>;
  tiedWinners?: Candidate[];
}

export type VotingMethodWithDetails = (profile: PreferenceProfile, candidates: Candidate[]) => VotingResult;
