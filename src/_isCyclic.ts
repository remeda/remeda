const MAX_DEPTH = 1000;

/**
 * Checks if the given value has any cyclic references.
 *
 * @param {unknown} value - The value to check for cyclic references.
 * @returns {boolean} - Returns true if the value contains cyclic references, otherwise false.
 */
export function isCyclic(value: unknown): boolean {
  const seenValues = new WeakSet(); // use to keep track of which objects have been seen.
  let depth = 0;

  function hasCycle(input: unknown) {
    depth++;

    // If max depth is exceeded, return false
    if (depth > MAX_DEPTH) {
      depth = 0;
      return false;
    }

    // If 'input' is an actual object, check if it's been seen already.
    if (input === null || typeof input !== 'object') {
      return false;
    }

    if (seenValues.has(input)) {
      return true;
    }

    // If 'input' hasn't been seen, add it to 'seenValues'.
    seenValues.add(input);

    if (Array.isArray(input)) {
      // If 'input' is an array, check if any of its elements are an object that has been seen already.
      return input.some(hasCycle);
    }

    if (input instanceof Map || input instanceof Set) {
      // Convert Map/Set values to an array
      return Array.from(input.values()).some(hasCycle);
    }

    // Recurse through the object, looking for more circular references.
    return Object.values(input).some(hasCycle);
  }

  return hasCycle(value);
}
