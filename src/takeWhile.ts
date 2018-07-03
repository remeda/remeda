export function takeWhile<T>(items: T[], fn: (item: T) => boolean) {
  const ret: T[] = [];
  for (const item of items) {
    if (!fn(item)) {
      break;
    }
    ret.push(item);
  }
  return ret;
}
