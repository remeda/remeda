export function toPairs<T>(object: { [s: string]: T }): Array<[string, T]> {
  return Object.entries(object);
}
