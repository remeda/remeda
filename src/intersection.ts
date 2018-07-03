export function intersection<T>(source: T[], other: T[]) {
  const set = new Set(other);
  return source.filter(x => set.has(x));
}
