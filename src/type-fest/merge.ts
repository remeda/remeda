import type { EnforceOptional } from "./enforce-optional";
import type { OmitIndexSignature } from "./omit-index-signature";
import type { PickIndexSignature } from "./pick-index-signature";

// Merges two objects without worrying about index signatures.
type SimpleMerge<Destination, Source> = {
  [Key in keyof Destination as Key extends keyof Source
    ? never
    : Key]: Destination[Key];
} & Source;

export type Merge<Destination, Source> = EnforceOptional<
  SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>> &
    SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
>;
