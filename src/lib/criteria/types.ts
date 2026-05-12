import type { SocialWelfareFunction, Candidate, PreferenceProfile, Ranking } from "../voting/types";

export interface CriterionResult {
  satisfied: boolean;
  counterexample?: {
    description: string;
    profile?: PreferenceProfile;
    profile2?: PreferenceProfile;
    result?: Ranking;
    result2?: Ranking;
  };
}

export type CriterionChecker = (
  swf: SocialWelfareFunction,
  candidates: Candidate[]
) => CriterionResult;
