export function _isContainsMultiSetImplementation<TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction?: (item: TData | TOther) => unknown
): boolean {
  if (other.length === 0) {
    // The empty set is contained in all sets.
    return true;
  }

  if (data.length === 0) {
    // A non-empty set would never be contained in an empty array.
    return false;
  }

  // To perform a multi-set operation we need to "consume" a value from the
  // `data` array for each value in our `other` array. To keep track of this
  // we need to count how many "consumptions" we have for each value.
  const remaining = new Map<unknown, number>();
  for (const item of data) {
    const scalar = scalarFunction === undefined ? item : scalarFunction(item);
    const previousCount = remaining.get(scalar) ?? 0;
    remaining.set(scalar, previousCount + 1);
  }

  for (const item of other) {
    const scalar = scalarFunction === undefined ? item : scalarFunction(item);
    const copies = remaining.get(scalar);
    if (copies === undefined || copies === 0) {
      // The item is not contained in the other array so data isn't contained
      // in it.
      return false;
    }

    remaining.set(scalar, copies - 1);
  }

  return true;
}
