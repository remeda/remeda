export function prop<T, K extends keyof T>(name: K) {
  return (obj: T) => obj[name];
}
