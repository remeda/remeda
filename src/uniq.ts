export function uniq<T>(array: T[]) {
  const set = new Set<T>();
  return array.filter(item => {
    if (set.has(item)) {
      return false;
    }
    set.add(item);
    return true;
  });
}
