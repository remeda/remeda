export function dropLast<T>(items: T[], count: number) {
  const copy = [...items];
  copy.splice(-count);
  return copy;
}
