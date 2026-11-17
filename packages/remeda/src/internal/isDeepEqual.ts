// The logic for `isDeepEqual` is reused in `hasSubObject`, so to avoid needing
// to import the exported utility's data-last harness we pull out the common
// logic as an internal utility.
export function isDeepEqual<T>(data: unknown, other: T): data is T {
  if (data === other || Object.is(data, other)) {
    // We ignore the slight differences between `===` and `Object.is` as both
    // of them largely define equality from a semantic point-of-view.
    return true;
  }

  if (
    typeof data !== "object" ||
    data === null ||
    typeof other !== "object" ||
    other === null ||
    // If the objects don't share a prototype it's unlikely that they are
    // semantically equal. It is technically possible to build 2 prototypes that
    // act the same but are not equal (at the reference level, checked via
    // `===`) and then create 2 objects that are equal although we would fail on
    // them. Because this is so unlikely, the optimization we gain here for the
    // rest of the function by assuming that `other` is of the same type as
    // `data` is more than worth it.
    !isComparablePrototype(data, other)
  ) {
    return false;
  }

  if (Array.isArray(data)) {
    return isDeepEqualArrays(data, other as unknown as readonly unknown[]);
  }

  if (data instanceof Map) {
    return isDeepEqualMaps(data, other as unknown as Map<unknown, unknown>);
  }

  if (data instanceof Set) {
    return isDeepEqualSets(data, other as unknown as Set<unknown>);
  }

  if (data instanceof Date) {
    return data.getTime() === (other as unknown as Date).getTime();
  }

  if (data instanceof RegExp) {
    return data.toString() === (other as unknown as RegExp).toString();
  }

  // At this point we only know that the 2 objects have a comparable prototype and are not
  // any of the previous types. They could be plain objects (Object.prototype),
  // they could be classes, they could be other built-ins, or they could be
  // something weird. We assume that comparing values by keys is enough to judge
  // their equality.

  if (Object.keys(data).length !== Object.keys(other).length) {
    return false;
  }

  for (const entry of Object.entries(data)) {
    const key = entry[0];
    if (
      !Object.hasOwn(other, key) ||
      !isDeepEqual(
        entry[1],
        // @ts-expect-error [ts7053] -- We already checked that `other` has `key`
        other[key],
      )
    ) {
      return false;
    }
  }

  return true;
}

function isComparablePrototype(data: object, other: object): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is a low-level check, we can't avoid it being typed as `any`.
  const dataPrototype = Object.getPrototypeOf(data);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is a low-level check, we can't avoid it being typed as `any`.
  const otherPrototype = Object.getPrototypeOf(other);

  if (dataPrototype === otherPrototype) {
    return true;
  }

  if (dataPrototype === null) {
    return otherPrototype === Object.prototype;
  }

  return dataPrototype === Object.prototype && otherPrototype === null;
}

function isDeepEqualArrays(
  data: readonly unknown[],
  other: readonly unknown[],
): boolean {
  if (data.length !== other.length) {
    return false;
  }

  let index = 0;
  for (const item of data) {
    if (!isDeepEqual(item, other[index])) {
      return false;
    }
    index += 1;
  }

  return true;
}

function isDeepEqualMaps(
  data: ReadonlyMap<unknown, unknown>,
  other: ReadonlyMap<unknown, unknown>,
): boolean {
  if (data.size !== other.size) {
    return false;
  }

  for (const entry of data) {
    const key = entry[0];
    if (!other.has(key) || !isDeepEqual(entry[1], other.get(key))) {
      return false;
    }
  }

  return true;
}

function isDeepEqualSets(
  data: ReadonlySet<unknown>,
  other: ReadonlySet<unknown>,
): boolean {
  if (data.size !== other.size) {
    return false;
  }

  // To ensure we only count each item once we need to "remember" which items of
  // the other set we've already matched against. We do this by creating a copy
  // of the other set and removing items from it as we find them in the data
  // set.
  const otherCopy = [...other];

  for (const dataItem of data) {
    const matchIndex = otherCopy.findIndex((otherItem) =>
      isDeepEqual(dataItem, otherItem),
    );

    if (matchIndex === -1) {
      return false;
    }

    otherCopy.splice(matchIndex, 1);
  }

  return true;
}
