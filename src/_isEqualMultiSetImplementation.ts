export function _isEqualMultiSetImplementation<TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction?: (item: TData | TOther) => unknown
): boolean {
  if (data.length !== other.length) {
    return false;
  }

  const remaining = new Map<unknown, number>();
  for (const item of other) {
    const scalar = scalarFunction === undefined ? item : scalarFunction(item);
    const previousCount = remaining.get(scalar) ?? 0;
    remaining.set(scalar, previousCount + 1);
  }

  for (const item of data) {
    const scalar = scalarFunction === undefined ? item : scalarFunction(item);
    const copies = remaining.get(scalar);

    if (copies === undefined) {
      return false;
    }

    if (copies > 1) {
      remaining.set(scalar, copies - 1);
    } else {
      remaining.delete(scalar);
    }
  }

  return remaining.size === 0;
}
