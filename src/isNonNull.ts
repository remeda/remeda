export function isNonNull<T>(data: T | null): data is T {
  return data !== null;
}
