import type { ArrayIndices, IsNumericLiteral } from "type-fest";
import type { ClampedIntegerSubtract } from "./ClampedIntegerSubtract";
import type { IntRangeInclusive } from "./IntRangeInclusive";
import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";
import type { If } from "./If";

export type ArrayAt<T extends IterableContainer, I extends number> = If<
  IsNumericLiteral<I>,
  I extends unknown
    ? If<
        HasIndex<
          [...TupleParts<T>["required"], ...TupleParts<T>["optional"]],
          I
        >,
        T[I],
        | TupleParts<T>["item"]
        | If<
            HasIndex<
              TupleParts<T>["suffix"],
              ClampedIntegerSubtract<
                I,
                [
                  ...TupleParts<T>["required"],
                  ...TupleParts<T>["optional"],
                ]["length"]
              >
            >,
            TupleParts<T>["suffix"][IntRangeInclusive<
              0,
              ClampedIntegerSubtract<
                I,
                [
                  ...TupleParts<T>["required"],
                  ...TupleParts<T>["optional"],
                ]["length"]
              >
            >],
            TupleParts<T>["suffix"][number] | undefined
          >
      >
    : never,
  T[number] | undefined
>;

type HasIndex<T extends ReadonlyArray<unknown>, I extends number> =
  I extends ArrayIndices<T> ? true : false;
