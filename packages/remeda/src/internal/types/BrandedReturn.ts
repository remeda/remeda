import type { Tagged } from "type-fest";
import type { StrictFunction } from "./StrictFunction";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- We want to confine the typing to a specific symbol
declare const TAG_NAME_BRANDED_RETURN: unique symbol;

export type BrandedReturn<F extends StrictFunction> = (
  ...args: Parameters<F>
) => Tagged<ReturnType<F>, typeof TAG_NAME_BRANDED_RETURN, F>;
