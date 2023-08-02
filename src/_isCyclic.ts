/**
 * Checks if the given value has any cyclic references.
 *
 * @param {unknown} value - The value to check for cyclic references.
 * @returns {boolean} - Returns true if the value contains cyclic references, otherwise false.
 */
export function isCyclic(value: unknown) {
  const seenValues = new WeakSet(); // use to keep track of which objects have been seen.

  function hasCycle(input: unknown) {
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
     
    // Recurse through the object, looking for more circular references.
    return Object.values(input).some(hasCycle);
  }

  return hasCycle(value);
}
