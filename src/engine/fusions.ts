import fusions from '../data/fusions.json';

const map = new Map<string, number>();
for (const { materials, result } of fusions) {
  const key = materials.sort().join('-');        // normalised key
  map.set(key, result);
}

export function checkFusion(a: number, b: number): number | null {
  const key = [a, b].sort().join('-');
  return map.get(key) ?? null;
}
