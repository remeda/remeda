import { dataLastImplementation } from "./dataLastImplementation";
import type { LazyDefinition } from "./types/LazyDefinition";
import type { SimplifiedWritable } from "./types/SimplifiedWritable";
import type { StrictFunction } from "./types/StrictFunction";

/**
 * Use this helper function to build the data last implementation together with
 * a lazy implementation. Use this when you need to build your own purrying
 * logic when you want to decide between dataFirst and dataLast on something
 * that isn't the number of arguments provided. This is useful for implementing
 * functions with optional or variadic arguments.
 */
export function lazyDataLastImplementation(
  fn: StrictFunction,
  args: readonly unknown[],
  lazy: LazyDefinition["lazy"],
  // TODO: We can probably provide better typing to the return type...
): unknown {
  const dataLast = dataLastImplementation(fn, args);

  // We are injecting the props onto the function itself!
  (dataLast as unknown as SimplifiedWritable<LazyDefinition>).lazy = lazy;
  (dataLast as unknown as SimplifiedWritable<LazyDefinition>).lazyArgs = args;

  return dataLast;
}
