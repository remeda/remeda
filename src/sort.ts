export function sort<T>(items: T[], cmp: (a: T, b: T) => number) {
  const ret = [...items];
  ret.sort(cmp);
  return ret;
}
