import type { OmitIndexSignature } from "./omit-index-signature";
import type { PickIndexSignature } from "./pick-index-signature";
import type { Simplify } from "./simplify";

// Merges two objects without worrying about index signatures.
type SimpleMerge<Destination, Source> = Source & {
  [Key in keyof Destination as Key extends keyof Source
    ? never
    : Key]: Destination[Key];
};

export type Merge<Destination, Source> = Simplify<
  SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>> &
    SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>>
>;
