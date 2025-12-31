import { Merge } from "type-fest";

//#region src/internal/types/OptionalOptionsWithDefaults.d.ts

/**
 * A simplified version of type-fest's `ApplyDefaultOptions` which isn't
 * exported. It allows us to provide a default fallback for an optional option.
 */
type OptionalOptionsWithDefaults<T, Provided extends T, Defaults extends T> = Merge<Defaults, { [Key in keyof Provided as Extract<Provided[Key], undefined> extends never ? Key : never]: Provided[Key] }> & Required<T>;
//#endregion
export { OptionalOptionsWithDefaults as t };
//# sourceMappingURL=OptionalOptionsWithDefaults-C-asSJ_E.d.ts.map