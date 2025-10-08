import type { Merge } from "type-fest";

/**
 * A simplified version of type-fest's `ApplyDefaultOptions` which isn't
 * exported. It allows us to provide a default fallback for an optional option.
 */
export type OptionalOptionsWithDefaults<
  T,
  Provided extends T,
  Defaults extends T,
> = Merge<
  Defaults,
  {
    // Defaults are only relevant for optional properties and need to be merged
    // with a non-optional version of the provided options to remove the
    // unreachable `undefined` parts.
    [Key in keyof Provided as Extract<Provided[Key], undefined> extends never
      ? Key
      : never]: Provided[Key];
  }
> &
  // After merging with the defaults there should be no optional properties
  // left. This allows any downstream type to avoid needing to handle any
  // `undefined`.
  Required<T>;
