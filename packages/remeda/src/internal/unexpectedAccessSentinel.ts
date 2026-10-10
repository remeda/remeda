import type { Tagged } from "type-fest";

const UNEXPECTED_ACCESS_MESSAGE =
  "Remeda: unexpected access to a callback's `data` argument during lazy evaluation.";

// The canonical array indices, which every indexed read and write uses as its
// key.
const ARRAY_INDEX = /^(?:0|[1-9]\d*)$/u;

/**
 * Provided to a callback's `data` parameter whenever we believe it would not
 * be used. A callback only gets to read it by slipping through the arity gate.
 *
 * Using it as an array throws (an index, any `Array.prototype` key such as
 * `length` or a method, iterating it, listing its keys), and so does writing
 * to it, so the first such use signals that `data` wasn't collected for this
 * callback: usually one of the holes documented on `canReadData`, otherwise a
 * detection bug worth reporting. Reads of any other key return `undefined`,
 * so code that only probes its arguments (e.g. a curried wrapper looking for a
 * placeholder) isn't broken by an argument it was never going to use.
 *
 * @see canReadData
 */
// @ts-expect-error [ts2322] -- The target's only item is the message, not a `never`, but any attempt to use the proxy as an array throws, so no code that relies on its type can run past the first touch.
export const UNEXPECTED_ACCESS_SENTINEL: Tagged<
  readonly never[],
  "RemedaUnexpectedAccessSentinel"
> = new Proxy(
  // An array, so type checks (`Array.isArray`, `instanceof Array`,
  // `Object.prototype.toString`) treat a misused `data` as the array its type
  // claims, and built-ins that consume arrays (`concat`, `flat`, deep
  // equality) reach the throwing traps instead of treating it as a single
  // object. `console.log` and devtools print a proxy's target without running
  // its traps, so the message lives on the target's only element and a logged
  // `data` still explains itself.
  [{ error: UNEXPECTED_ACCESS_MESSAGE }],
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

    // `getPrototypeOf` and `isExtensible` are left to the target, so the
    // sentinel reports `Array.prototype` like any array literal. Every key it
    // inherits is on `Array.prototype`, so reading one throws above.

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
