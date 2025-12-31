import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as PartialArray } from "./PartialArray-ChqAZrje.js";
import { t as RemedaTypeError } from "./RemedaTypeError-D7wvGSrH.js";
import { t as TupleParts } from "./TupleParts-CMigdcrz.js";
import { t as CoercedArray } from "./CoercedArray-DxS6j_hV.js";

//#region src/internal/types/TupleSplits.d.ts

/**
 * The union of all possible ways to write a tuple as [...left, ...right].
 */
type TupleSplits<T extends IterableContainer> = T extends unknown ?
// The complete set of all splits is the union of splitting each part of
SplitPrefix<T> | SplitOptional<T> | SplitRest<T> | SplitSuffix<T> : never;
type SplitPrefix<T extends IterableContainer> = FixedTupleSplits<TupleParts<T>["required"]> extends infer Req ? Req extends {
  left: infer Left;
  right: infer Right extends Array<unknown>;
} ? {
  left: Left;
  right: [...Right, ...PartialArray<TupleParts<T>["optional"]>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]];
} : RemedaTypeError<"SplitPrefix", "Unexpected result shape from FixedTupleSplits", {
  type: never;
  metadata: [Req, T];
}> : never;
type SplitOptional<T extends IterableContainer> = FixedTupleSplits<TupleParts<T>["optional"]> extends infer Optional ? Optional extends {
  left: infer Left extends Array<unknown>;
  right: infer Right extends Array<unknown>;
} ? {
  left: [...TupleParts<T>["required"], ...PartialArray<Left>];
  right: [...PartialArray<Right>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]];
} : RemedaTypeError<"SplitOptional", "Unexpected result shape from FixedTupleSplits", {
  type: never;
  metadata: [Optional, T];
}> : never;
type SplitRest<T extends IterableContainer> = {
  left: [...TupleParts<T>["required"], ...PartialArray<TupleParts<T>["optional"]>, ...CoercedArray<TupleParts<T>["item"]>];
  right: [...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]];
};
type SplitSuffix<T extends IterableContainer> = FixedTupleSplits<TupleParts<T>["suffix"]> extends infer Suffix ? Suffix extends {
  left: infer Left extends Array<unknown>;
  right: infer Right;
} ? {
  left: [...TupleParts<T>["required"], ...PartialArray<TupleParts<T>["optional"]>, ...CoercedArray<TupleParts<T>["item"]>, ...Left];
  right: Right;
} : RemedaTypeError<"SplitSuffix", "Unexpected result shape from FixedTupleSplits", {
  type: never;
  metadata: [Suffix, T];
}> : never;
type FixedTupleSplits<L, R extends Array<unknown> = []> = {
  left: L;
  right: R;
} | (L extends readonly [...infer Head, infer Tail] ? FixedTupleSplits<Head, [Tail, ...R]> : never);
//#endregion
export { TupleSplits as t };
//# sourceMappingURL=TupleSplits-BQfCJsGh.d.ts.map