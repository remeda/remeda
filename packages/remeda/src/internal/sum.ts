import type { IterableContainer } from "./types/IterableContainer";

// The logic for `sum` is reused in `mean`, so to avoid needing to import the
// exported utility's data-last harness we pull out the common logic as an
// internal utility.
export function sum<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): T[number] {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- The rule differentiates 0 and 0n :(
  let out = typeof data[0] === "bigint" ? 0n : 0;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    out += value;
  }
  return out;
}
