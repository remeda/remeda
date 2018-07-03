export function splitAt<T>(items: T[], index: number) {
  const copy = [...items];
  const tail = copy.splice(index);
  return [copy, tail];
}
