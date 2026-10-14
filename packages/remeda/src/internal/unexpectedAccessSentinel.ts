import type { Tagged } from "type-fest";

const UNEXPECTED_ACCESS_MESSAGE =
  "Remeda: unexpected access to a callback's `data` argument during lazy evaluation.";

// The canonical array indices, which every indexed read and write uses as its
// key.
const ARRAY_INDEX = /^(?:0|[1-9]\d*)$/u;

// We use an array here because some checks bypass our proxy: `Array.isArray`,
// `Object.prototype.toString`'s tag, and whether `concat` and `flat` spread
// it. Any other target would fail those checks, raising errors that never
// mention the sentinel, or get spread as a single item instead of reaching the
// throwing traps.
const SENTINEL_RUNTIME_TARGET = [
  {
    // We also inject our error message directly into the object so that
    // `console.log` and devtools that print a proxy's target without running
    // its traps still see a hint that something went wrong.
    error: UNEXPECTED_ACCESS_MESSAGE,
  },
];

/**
 * Provided to a callback's `data` parameter whenever we believe it would not
 * be used. A callback only gets to read it by slipping through the arity gate.
 *
 * It answers like an array to anything that only asks what kind of value it
 * is (`Array.isArray`, `instanceof`, its prototype), so wrappers that inspect
 * every argument they forward (e.g., a curried function looking for a
 * placeholder) don't break on an argument they never use. Reading what it
 * holds throws (an index, any `Array.prototype` key such as `length` or a
 * method, iterating it, listing its keys), and so does writing to it, so the
 * first such use signals that `data` wasn't collected for this callback: as a
 * result of a known limitation to our heuristics in `canReadData`, or a case
 * we haven't considered yet.
 *
 *! **IMPORTANT**: It is highly likely to never happen in user's code, and users are encouraged to open an issue whenever they encounter it. As a workaround, users should try to change the function signature that caused it either by removing defaults, rest params, or by wrapping the function with an arrow function that lists the function's params explicitly and delegates them one-by-one!
 */
// @ts-expect-error [ts2322] -- Intentional! the target's first item is an error object so that it is surfaced to users in cases where they bypass the proxy and reach the target object itself. We don't use `unknown` for the item types (and use an empty tuple instead) so that if anything tries to use the sentinel it would be blocked at the type level too.
export const UNEXPECTED_ACCESS_SENTINEL: Tagged<
  readonly [],
  "RemedaUnexpectedAccessSentinel"
> = new Proxy(SENTINEL_RUNTIME_TARGET, {
  // Hooks that inspect the contents of the data:
  get: throwOnArrayKey,
  getOwnPropertyDescriptor: throwOnArrayKey,
  // @ts-expect-error [ts2322] -- The `has` trap's result goes through `ToBoolean`, so the `undefined` returned for any other key reports it as missing, same as `false`.
  has: throwOnArrayKey,
  ownKeys: alwaysThrow,

  // Any sort of mutation to the data:
  defineProperty: alwaysThrow,
  deleteProperty: alwaysThrow,
  preventExtensions: alwaysThrow,
  set: alwaysThrow,
  setPrototypeOf: alwaysThrow,

  // Intentionally not proxied:
  // - `getPrototypeOf` only asks about its shape, which the target already
  // answers for the checks that skip the traps; answering them here would only
  // duplicate it.
  // - `isExtensible` must match the target.
  // - `apply`, `construct` are only relevant for callable targets (e.g.,
  // functions).
});

// Allows us to pass generic checks on the object through without tripping the
// trap. This allows frameworks which inspect the object without treating it as
// an array still handle the object; we only throw when the object is treated
// like an actual array.
function throwOnArrayKey(_: unknown, key: string | symbol): undefined {
  if (
    // eslint-disable-next-line unicorn/no-computed-property-existence-check -- Intentional! `Array.prototype` is itself an array, so its keys include `length`, and it inherits every key of `Object.prototype`. inherited keys like `toString` are array keys too, and `Object.hasOwn` would miss them.
    key in Array.prototype ||
    ARRAY_INDEX.test(String(key))
  ) {
    alwaysThrow();
  }
}

function alwaysThrow(): never {
  throw new Error(UNEXPECTED_ACCESS_MESSAGE);
}
