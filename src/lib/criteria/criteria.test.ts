import { describe, it, expect } from "vitest";
import type { PreferenceProfile, Candidate, Ranking } from "../voting/types";
import { plurality } from "../voting/plurality";
import { checkPareto } from "./pareto";
import { checkIIA } from "./iia";
import { checkUnrestrictedDomain } from "./unrestricted";
import { checkNonDictatorship } from "./dictatorship";

const candidates: Candidate[] = ["A", "B", "C"];

function dictator(profile: PreferenceProfile, _candidates: Candidate[]): Ranking {
  return [...profile[0]!];
}

describe("checkPareto", () => {
  it("plurality satisfies Pareto", () => {
    const result = checkPareto(plurality, candidates);
    expect(result.satisfied).toBe(true);
  });

  it("dictator satisfies Pareto", () => {
    const result = checkPareto(dictator, candidates);
    expect(result.satisfied).toBe(true);
  });

  it("detects a Pareto violation in a contrarian SWF", () => {
    function contrarian(_profile: PreferenceProfile, candidates: Candidate[]): Ranking {
      return [...candidates].reverse();
    }
    const result = checkPareto(contrarian, candidates);
    expect(result.satisfied).toBe(false);
    expect(result.counterexample).toBeDefined();
  });
});

describe("checkIIA", () => {
  it("plurality violates IIA", () => {
    const result = checkIIA(plurality, candidates);
    expect(result.satisfied).toBe(false);
    expect(result.counterexample).toBeDefined();
    expect(result.counterexample!.profile).toBeDefined();
    expect(result.counterexample!.profile2).toBeDefined();
  });

  it("dictator satisfies IIA", () => {
    const result = checkIIA(dictator, candidates);
    expect(result.satisfied).toBe(true);
  });
});

describe("checkUnrestrictedDomain", () => {
  it("plurality satisfies unrestricted domain", () => {
    const result = checkUnrestrictedDomain(plurality, candidates);
    expect(result.satisfied).toBe(true);
  });

  it("detects an SWF that throws on certain inputs", () => {
    function fragile(profile: PreferenceProfile, candidates: Candidate[]): Ranking {
      if (profile[0]![0] === "C") throw new Error("Cannot handle C first");
      return [...candidates];
    }
    const result = checkUnrestrictedDomain(fragile, candidates);
    expect(result.satisfied).toBe(false);
  });

  it("detects an SWF that returns an invalid ranking", () => {
    function broken(_profile: PreferenceProfile, _candidates: Candidate[]): Ranking {
      return ["A", "A", "B"];
    }
    const result = checkUnrestrictedDomain(broken, candidates);
    expect(result.satisfied).toBe(false);
  });
});

describe("checkNonDictatorship", () => {
  it("plurality satisfies non-dictatorship", () => {
    const result = checkNonDictatorship(plurality, candidates);
    expect(result.satisfied).toBe(true);
  });

  it("dictator violates non-dictatorship", () => {
    const result = checkNonDictatorship(dictator, candidates);
    expect(result.satisfied).toBe(false);
    expect(result.counterexample).toBeDefined();
    expect(result.counterexample!.description).toContain("Voter 1");
  });

  it("second-voter dictator is detected", () => {
    function dictator1(profile: PreferenceProfile, _candidates: Candidate[]): Ranking {
      return [...profile[1]!];
    }
    const result = checkNonDictatorship(dictator1, candidates);
    expect(result.satisfied).toBe(false);
    expect(result.counterexample!.description).toContain("Voter 2");
  });
});
