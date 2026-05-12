export type {
  Candidate,
  Ranking,
  PreferenceProfile,
  VotingMethod,
  SocialWelfareFunction,
  VotingResult,
  VotingMethodWithDetails,
} from "./types";

export { plurality, pluralityWithDetails } from "./plurality";
export { borda, bordaWithDetails } from "./borda";
export { irv, irvWithDetails } from "./irv";
export { condorcet, condorcetWithDetails } from "./condorcet";
export { approval, approvalWithDetails } from "./approval";
