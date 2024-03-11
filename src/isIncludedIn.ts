import type { IterableContainer } from "./_types";

export function isIncludedIn<T, S extends T>(
  data: T,
  container: IterableContainer<S>,
): data is S;

export function isIncludedIn<T, S extends T>(
  container: IterableContainer<S>,
): (data: T) => data is S;

export function isIncludedIn(
  dataOrContainer: unknown,
  container?: ReadonlyArray<unknown>,
): unknown {
  if (container === undefined) {
    // === dataLast ===
    // We don't use purry here because we can optimize the dataLast case by
    // memoizing a set and accessing it in O(1) time instead of scanning the
    // array **each time** (O(n)) each time.
    const asSet = new Set(dataOrContainer as ReadonlyArray<unknown>);
    return (data: unknown) => asSet.has(data);
  }

  // === dataFirst ===
  return container.indexOf(dataOrContainer) >= 0;
}
