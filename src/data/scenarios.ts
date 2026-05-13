import type { Ranking } from "@/lib/voting/types";

export interface Scenario {
  name: string;
  candidates: string[];
  voters: { name: string; ranking: Ranking }[];
}

export const restaurantScenario: Scenario = {
  name: "Picking a restaurant",
  candidates: ["Sushi Place", "Pizza Joint", "Taco Spot"],
  voters: [
    { name: "Alice", ranking: ["Sushi Place", "Pizza Joint", "Taco Spot"] },
    { name: "Bob", ranking: ["Pizza Joint", "Sushi Place", "Taco Spot"] },
    { name: "Carol", ranking: ["Pizza Joint", "Taco Spot", "Sushi Place"] },
  ],
};

export const spoilerScenario: Scenario = {
  name: "Spoiler effect",
  candidates: ["A", "B"],
  voters: [
    { name: "Voter 1", ranking: ["A", "B"] },
    { name: "Voter 2", ranking: ["A", "B"] },
    { name: "Voter 3", ranking: ["B", "A"] },
  ],
};

export const spoilerWithThird: Scenario = {
  name: "Spoiler effect with third candidate",
  candidates: ["A", "B", "C"],
  voters: [
    { name: "Voter 1", ranking: ["A", "C", "B"] },
    { name: "Voter 2", ranking: ["C", "A", "B"] },
    { name: "Voter 3", ranking: ["B", "A", "C"] },
  ],
};

export const unanimousScenario: Scenario = {
  name: "Unanimous agreement",
  candidates: ["A", "B", "C"],
  voters: [
    { name: "Voter 1", ranking: ["A", "B", "C"] },
    { name: "Voter 2", ranking: ["A", "B", "C"] },
    { name: "Voter 3", ranking: ["A", "B", "C"] },
  ],
};
