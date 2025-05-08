import type { IterableContainer } from "./IterableContainer";
import type { TupleParts, TuplePrefix } from "./TupleParts";
import type { CoercedArray } from "./CoercedArray";

/**
 * The union of all possible ways to write a tuple as [...left, ...right].
 */
export type TupleSplits<T extends IterableContainer> =
  // Use a distributive conditional type, in case T is a union:
  T extends unknown
    ?
        | FixedTupleSplits<
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: We need to consider how the 'optional' part of the tuple is handled in this type
            TuplePrefix<T>,
            [...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]]
          >
        | {
            left: [
              // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: We need to consider how the 'optional' part of the tuple is handled in this type
              ...TuplePrefix<T>,
              ...CoercedArray<TupleParts<T>["item"]>,
            ];
            right: [
              ...CoercedArray<TupleParts<T>["item"]>,
              ...TupleParts<T>["suffix"],
            ];
          }
        | (FixedTupleSplits<TupleParts<T>["suffix"]> extends infer U
            ? U extends {
                left: infer L extends ReadonlyArray<unknown>;
                right: infer R;
              }
              ? {
                  left: [
                    // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: We need to consider how the 'optional' part of the tuple is handled in this type
                    ...TuplePrefix<T>,
                    ...CoercedArray<TupleParts<T>["item"]>,
                    ...L,
                  ];
                  right: R;
                }
              : never
            : never)
    : never;

/**
 * Helper type for `TupleSplits`, for tuples without rest params.
 */
type FixedTupleSplits<
  L extends IterableContainer,
  R extends IterableContainer = [],
> =
  | { left: L; right: R }
  | (L extends readonly []
      ? never
      : L extends readonly [...infer LHead, infer LTail]
        ? FixedTupleSplits<LHead, [LTail, ...R]>
        : L extends readonly [...infer LHead, (infer LTail)?]
          ? FixedTupleSplits<LHead, [LTail?, ...R]>
          : never);
