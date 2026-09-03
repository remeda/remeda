/**
 * When needing to negate a boolean types that is checked via `extends true`
 * its better to flip the outcome rather than flipping the check itself
 * (`extends false`) to make the code more readable and more deliberate that the
 * result has been flipped.
 */
export type IsNot<T extends boolean> = boolean extends T
  ? boolean
  : T extends true
    ? false
    : true;
