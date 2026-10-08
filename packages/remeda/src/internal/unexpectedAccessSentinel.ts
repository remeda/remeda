import type { Tagged } from "type-fest";

const UNEXPECTED_ACCESS_MESSAGE =
  "Remeda: a callback used its `data` argument as an array, but didn't declare it as a parameter, so Remeda didn't provide it. Declare it, e.g. `(value, index, data) => ...`.";

// The canonical array indices, which every indexed read and write uses as its
// key.
const ARRAY_INDEX = /^(?:0|[1-9]\d*)$/u;

/**
 * Provided to a callback's `data` parameter whenever we believe it would not
 * be used. A callback only receives it by slipping through the arity gate.
 *
 * Using it as an array throws (an index, `length`, an array method, iterating
 * it, listing its keys), and so does writing to it, so the first such use
 * signals that `data` wasn't collected for this callback: usually one of the
 * holes documented on `requireDataByArity`, otherwise a detection bug worth
 * reporting. Every other read finds nothing, as on an empty object, so code
 * that only probes its arguments (e.g. a curried wrapper looking for a
 * placeholder) isn't broken by an argument it was never going to use.
 *
 * @see requireDataByArity
 */
// @ts-expect-error [ts2322] -- The proxy isn't an array, but any attempt to use it as one throws, so no code that relies on its type can run past the first touch.
export const UNEXPECTED_ACCESS_SENTINEL: Tagged<
  readonly never[],
  "RemedaUnexpectedAccessSentinel"
> = new Proxy(
  {
    // `console.log` and devtools print a proxy's target without running its
    // traps, so the message lives on the target too and a logged `data` still
    // explains itself.
    error: UNEXPECTED_ACCESS_MESSAGE,
  },
  {
    // Reads: using it as an array throws, anything else finds nothing.
    get: (_target, key) => {
      throwOnArrayKey(key);
    },
    getOwnPropertyDescriptor: (_target, key) => {
      throwOnArrayKey(key);
    },
    has: (_target, key) => {
      throwOnArrayKey(key);
      return false;
    },
    ownKeys: alwaysThrow,

    // `getPrototypeOf` and `isExtensible` are left to the target, an ordinary
    // object, so the sentinel reports `Object.prototype` like any object
    // literal: `instanceof Array` is false, while plain-object checks pass.
    // Every key it could inherit from there is also on `Array.prototype`, so
    // reading one throws above.

    // Writes: would otherwise reach the target, which every pipe shares.
    defineProperty: alwaysThrow,
    deleteProperty: alwaysThrow,
    preventExtensions: alwaysThrow,
    set: alwaysThrow,
    setPrototypeOf: alwaysThrow,

    // `apply` and `construct` are left out: they only fire for callable
    // targets.
  },
);

function throwOnArrayKey(key: string | symbol): void {
  // `Array.prototype` is itself an array, so its keys include `length`, and it
  // inherits every key of `Object.prototype`.
  if (
    Reflect.has(Array.prototype, key) ||
    (typeof key === "string" && ARRAY_INDEX.test(key))
  ) {
    alwaysThrow();
  }
}

function alwaysThrow(): never {
  throw new Error(UNEXPECTED_ACCESS_MESSAGE);
}
