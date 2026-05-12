export function permutations<T>(items: T[]): T[][] {
  if (items.length === 0) return [[]];
  if (items.length === 1) return [[items[0]!]];

  const result: T[][] = [];

  for (let i = 0; i < items.length; i++) {
    const current = items[i]!;
    const remaining = [...items.slice(0, i), ...items.slice(i + 1)];
    const subPermutations = permutations(remaining);
    for (const sub of subPermutations) {
      result.push([current, ...sub]);
    }
  }

  return result;
}
