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
      "Consider an election between two candidates, A and B. Start with all voters ranking B first. Then, one by one, move each voter to rank A first. At some point, the group outcome switches from B to A. The voter whose switch causes this change is the pivotal voter for the pair (A, B).",
    diagramType: "pivotal",
  },
  {
    title: "The pivotal voter has too much power",
    content:
      "Using the IIA criterion, we can show that this pivotal voter determines the outcome for every pair of candidates, not just A and B. Their individual preference always matches the group outcome.",
    diagramType: "dictator",
  },
  {
    title: "Contradiction",
    content:
      "But a voter whose preference always determines the group outcome is, by definition, a dictator. This contradicts the non-dictatorship criterion. Since our assumption led to a contradiction, no such voting system can exist.",
    diagramType: "contradiction",
  },
];
