export interface VotingMethodInfo {
  id: string;
  name: string;
  shortDescription: string;
  satisfies: {
    unrestricted: boolean;
    unanimity: boolean;
    iia: boolean;
    nonDictatorship: boolean;
  };
  note?: string;
}

export const votingMethodsInfo: VotingMethodInfo[] = [
  {
    id: "plurality",
    name: "Plurality",
    shortDescription: "Each voter picks their top choice. Most votes wins.",
    satisfies: {
      unrestricted: true,
      unanimity: true,
      iia: false,
      nonDictatorship: true,
    },
  },
  {
    id: "borda",
    name: "Borda Count",
    shortDescription:
      "Voters rank all candidates. Points are assigned by position. Highest total wins.",
    satisfies: {
      unrestricted: true,
      unanimity: true,
      iia: false,
      nonDictatorship: true,
    },
  },
  {
    id: "irv",
    name: "Instant Runoff",
    shortDescription:
      "Eliminate the candidate with fewest first-place votes and redistribute. Repeat until one remains.",
    satisfies: {
      unrestricted: true,
      unanimity: true,
      iia: false,
      nonDictatorship: true,
    },
  },
  {
    id: "condorcet",
    name: "Condorcet",
    shortDescription:
      "Compare every pair of candidates head-to-head. A candidate who wins all pairwise matchups is the winner.",
    satisfies: {
      unrestricted: true,
      unanimity: true,
      iia: false,
      nonDictatorship: true,
    },
    note: "A Condorcet winner does not always exist (cycles are possible).",
  },
  {
    id: "approval",
    name: "Approval Voting",
    shortDescription:
      "Each voter approves or disapproves of each candidate. Most approvals wins.",
    satisfies: {
      unrestricted: true,
      unanimity: true,
      iia: false,
      nonDictatorship: true,
    },
    note:
      "Not a ranked system, so Arrow's theorem does not directly apply. Included for comparison.",
  },
  {
    id: "score",
    name: "Score Voting",
    shortDescription:
      "Each voter gives each candidate a numerical score. Highest average score wins.",
    satisfies: {
      unrestricted: true,
      unanimity: true,
      iia: true,
      nonDictatorship: true,
    },
    note:
      "Not a ranked system, so Arrow's theorem does not directly apply. Satisfies IIA within its own framework.",
  },
];
