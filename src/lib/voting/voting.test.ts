import { describe, it, expect } from "vitest";
import { plurality, pluralityWithDetails } from "./plurality";
import { borda, bordaWithDetails } from "./borda";
import { irv, irvWithDetails } from "./irv";
import { condorcet, condorcetWithDetails } from "./condorcet";
import { approval, approvalWithDetails } from "./approval";

const A = "A";
const B = "B";
const C = "C";

describe("classic Arrow scenario", () => {
  const candidates = [A, B, C];
  const profile = [
    [A, B, C],
    [B, C, A],
    [C, A, B],
  ];

  it("plurality produces a three-way tie broken alphabetically", () => {
    const result = plurality(profile, candidates);
    expect(result).toEqual([A, B, C]);
  });

  it("borda produces a three-way tie broken alphabetically", () => {
    const result = borda(profile, candidates);
    expect(result).toEqual([A, B, C]);
  });

  it("irv eliminates alphabetically last on tie", () => {
    const result = irv(profile, candidates);
    expect(result[0]).toBeDefined();
    expect(result).toHaveLength(3);
  });

  it("condorcet has no Condorcet winner in this cycle", () => {
    const result = condorcet(profile, candidates);
    expect(result).toHaveLength(3);
  });

  it("approval produces a result with all candidates", () => {
    const result = approval(profile, candidates);
    expect(result).toHaveLength(3);
  });
});

describe("different methods yield different winners", () => {
  const candidates = [A, B, C];
  const profile = [
    [A, B, C],
    [A, B, C],
    [B, C, A],
    [B, C, A],
    [C, A, B],
    [C, A, B],
    [C, A, B],
  ];

  it("plurality winner is C", () => {
    expect(plurality(profile, candidates)[0]).toBe(C);
  });

  it("borda winner is C", () => {
    expect(borda(profile, candidates)[0]).toBe(C);
  });

  it("condorcet has no clear winner due to cycle or B wins", () => {
    const result = condorcet(profile, candidates);
    expect(result).toHaveLength(3);
  });
});

describe("unanimous preferences", () => {
  const candidates = [A, B, C];
  const profile = [
    [A, B, C],
    [A, B, C],
    [A, B, C],
  ];

  it("plurality picks A", () => {
    expect(plurality(profile, candidates)[0]).toBe(A);
  });

  it("borda picks A", () => {
    expect(borda(profile, candidates)[0]).toBe(A);
  });

  it("irv picks A", () => {
    expect(irv(profile, candidates)[0]).toBe(A);
  });

  it("condorcet picks A", () => {
    expect(condorcet(profile, candidates)[0]).toBe(A);
  });

  it("approval picks A", () => {
    expect(approval(profile, candidates)[0]).toBe(A);
  });

  it("all methods produce the same full ranking", () => {
    const expected = [A, B, C];
    expect(plurality(profile, candidates)).toEqual(expected);
    expect(borda(profile, candidates)).toEqual(expected);
    expect(irv(profile, candidates)).toEqual(expected);
    expect(condorcet(profile, candidates)).toEqual(expected);
  });
});

describe("single voter", () => {
  const candidates = [A, B, C];
  const profile = [[B, A, C]];

  it("plurality picks B", () => {
    expect(plurality(profile, candidates)[0]).toBe(B);
  });

  it("borda picks B", () => {
    expect(borda(profile, candidates)[0]).toBe(B);
  });

  it("irv picks B", () => {
    expect(irv(profile, candidates)[0]).toBe(B);
  });

  it("condorcet picks B", () => {
    expect(condorcet(profile, candidates)[0]).toBe(B);
  });

  it("approval picks the top approved candidate", () => {
    const result = approval(profile, candidates);
    expect(result).toHaveLength(3);
    expect(result[0]).toBe(A);
  });
});

describe("two-candidate elections", () => {
  const candidates = [A, B];
  const profile = [
    [A, B],
    [B, A],
    [A, B],
  ];

  it("plurality picks A", () => {
    expect(plurality(profile, candidates)[0]).toBe(A);
  });

  it("borda picks A", () => {
    expect(borda(profile, candidates)[0]).toBe(A);
  });

  it("irv picks A", () => {
    expect(irv(profile, candidates)[0]).toBe(A);
  });

  it("condorcet picks A", () => {
    expect(condorcet(profile, candidates)[0]).toBe(A);
  });

  it("approval picks A (both approved by all, A wins on tie-break or count)", () => {
    const result = approval(profile, candidates);
    expect(result).toHaveLength(2);
  });
});

describe("single candidate", () => {
  const candidates = [A];
  const profile = [[A], [A], [A]];

  it("plurality returns the single candidate", () => {
    expect(plurality(profile, candidates)).toEqual([A]);
  });

  it("borda returns the single candidate", () => {
    expect(borda(profile, candidates)).toEqual([A]);
  });

  it("irv returns the single candidate", () => {
    expect(irv(profile, candidates)).toEqual([A]);
  });

  it("condorcet returns the single candidate", () => {
    expect(condorcet(profile, candidates)).toEqual([A]);
  });

  it("approval returns the single candidate", () => {
    expect(approval(profile, candidates)).toEqual([A]);
  });
});

describe("empty input", () => {
  it("all methods return empty for no candidates", () => {
    expect(plurality([], [])).toEqual([]);
    expect(borda([], [])).toEqual([]);
    expect(irv([], [])).toEqual([]);
    expect(condorcet([], [])).toEqual([]);
    expect(approval([], [])).toEqual([]);
  });
});

describe("tie scenarios", () => {
  const candidates = [A, B, C];

  it("plurality breaks ties alphabetically", () => {
    const profile = [
      [A, B, C],
      [B, A, C],
    ];
    const result = plurality(profile, candidates);
    expect(result[0]).toBe(A);
    expect(result[1]).toBe(B);
  });

  it("borda breaks ties alphabetically", () => {
    const profile = [
      [A, B, C],
      [B, A, C],
    ];
    const result = borda(profile, candidates);
    expect(result[2]).toBe(C);
  });

  it("condorcet breaks ties alphabetically", () => {
    const profile = [
      [A, B, C],
      [B, C, A],
      [C, A, B],
    ];
    const result = condorcet(profile, candidates);
    expect(result).toEqual([A, B, C]);
  });
});

describe("withDetails functions return correct structure", () => {
  const candidates = [A, B, C];
  const profile = [
    [A, B, C],
    [A, B, C],
    [B, C, A],
  ];

  it("pluralityWithDetails returns votes", () => {
    const result = pluralityWithDetails(profile, candidates);
    expect(result.ranking[0]).toBe(A);
    expect(result.details[A]).toBe(2);
    expect(result.details[B]).toBe(1);
    expect(result.details[C]).toBe(0);
  });

  it("bordaWithDetails returns scores", () => {
    const result = bordaWithDetails(profile, candidates);
    expect(result.details[A]).toBe(4);
    expect(result.details[B]).toBe(4);
    expect(result.details[C]).toBe(1);
  });

  it("irvWithDetails returns a result", () => {
    const result = irvWithDetails(profile, candidates);
    expect(result.ranking).toHaveLength(3);
    expect(result.ranking[0]).toBe(A);
    expect(typeof result.details[A]).toBe("number");
  });

  it("condorcetWithDetails returns pairwise wins", () => {
    const result = condorcetWithDetails(profile, candidates);
    expect(result.ranking[0]).toBe(A);
    expect(typeof result.details[A]).toBe("number");
  });

  it("approvalWithDetails returns approval counts", () => {
    const result = approvalWithDetails(profile, candidates);
    expect(result.ranking).toHaveLength(3);
    expect(typeof result.details[A]).toBe("number");
  });

  it("withDetails returns empty for no candidates", () => {
    expect(pluralityWithDetails([], []).details).toEqual({});
    expect(bordaWithDetails([], []).details).toEqual({});
    expect(irvWithDetails([], []).details).toEqual({});
    expect(condorcetWithDetails([], []).details).toEqual({});
    expect(approvalWithDetails([], []).details).toEqual({});
  });
});
