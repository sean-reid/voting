export interface ProofStep {
  title: string;
  content: string;
  diagramType: "setup" | "pivotal" | "dictator" | "contradiction";
}

export const proofSteps: ProofStep[] = [
  {
    title: "Start with the assumption",
    content:
      "Suppose a voting system exists that satisfies all four of Arrow's criteria: unrestricted domain, unanimity, independence of irrelevant alternatives, and non-dictatorship.",
    diagramType: "setup",
  },
  {
    title: "Find the pivotal voter",
    content:
      "With three or more candidates, start with every voter ranking some candidate B last. By unanimity, society ranks B last too. Then, one by one, move each voter's ranking of B from last to first. At some point, B jumps from the bottom to the top of the social ranking. The voter whose switch causes this jump is the pivotal voter.",
    diagramType: "pivotal",
  },
  {
    title: "The pivotal voter has too much power",
    content:
      "Using IIA and unanimity together, we can show that this pivotal voter determines the social ranking for every pair of candidates, not just those involving B. Place B between any two other candidates A and C in the pivotal voter's ranking while other voters place B at an extreme. IIA and unanimity force A above B and B above C socially. Since A and C were arbitrary, the pivotal voter controls every comparison.",
    diagramType: "dictator",
  },
  {
    title: "Contradiction",
    content:
      "But a voter whose preference always determines the group outcome is, by definition, a dictator. This contradicts the non-dictatorship criterion. Since our assumption led to a contradiction, no such voting system can exist.",
    diagramType: "contradiction",
  },
];
