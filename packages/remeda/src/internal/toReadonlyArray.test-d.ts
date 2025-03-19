import { toReadonlyArray } from "./toReadonlyArray";

expectTypeOf(toReadonlyArray([1, 2, 3])).toEqualTypeOf<ReadonlyArray<number>>();
