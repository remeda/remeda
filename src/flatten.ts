export function flatten<T>(items: T[][]): T[] {
  const ret: T[] = [];
  items.forEach(item => {
    if (Array.isArray(item)) {
      ret.push(...item);
    } else {
      ret.push(item);
    }
  });
  return ret;
}
