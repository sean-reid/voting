import { describe, it, expect } from "vitest";
import { permutations } from "./permutations";

describe("permutations", () => {
  it("returns one empty permutation for empty array", () => {
    expect(permutations([])).toEqual([[]]);
  });

  it("returns single element for single-item array", () => {
    expect(permutations([1])).toEqual([[1]]);
  });

  it("returns 2 permutations for 2 elements", () => {
    const result = permutations([1, 2]);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual([1, 2]);
    expect(result).toContainEqual([2, 1]);
  });

  it("returns 6 permutations for 3 elements", () => {
    const result = permutations(["A", "B", "C"]);
    expect(result).toHaveLength(6);
  });

  it("returns 24 permutations for 4 elements", () => {
    const result = permutations([1, 2, 3, 4]);
    expect(result).toHaveLength(24);
  });

  it("produces n! permutations", () => {
    const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
    for (let n = 0; n <= 5; n++) {
      const items = Array.from({ length: n }, (_, i) => i);
      expect(permutations(items)).toHaveLength(factorial(n));
    }
  });

  it("all permutations are unique", () => {
    const result = permutations([1, 2, 3, 4]);
    const serialized = result.map((p) => JSON.stringify(p));
    const unique = new Set(serialized);
    expect(unique.size).toBe(result.length);
  });

  it("each permutation contains exactly the original elements", () => {
    const items = [10, 20, 30];
    const result = permutations(items);
    for (const perm of result) {
      expect([...perm].sort((a, b) => a - b)).toEqual([10, 20, 30]);
    }
  });

  it("contains expected specific permutations", () => {
    const result = permutations(["X", "Y", "Z"]);
    expect(result).toContainEqual(["X", "Y", "Z"]);
    expect(result).toContainEqual(["X", "Z", "Y"]);
    expect(result).toContainEqual(["Y", "X", "Z"]);
    expect(result).toContainEqual(["Y", "Z", "X"]);
    expect(result).toContainEqual(["Z", "X", "Y"]);
    expect(result).toContainEqual(["Z", "Y", "X"]);
  });

  it("works with string arrays for voting scenarios", () => {
    const candidates = ["Alice", "Bob", "Carol"];
    const result = permutations(candidates);
    expect(result).toHaveLength(6);
    expect(result[0]).toHaveLength(3);
  });
});
