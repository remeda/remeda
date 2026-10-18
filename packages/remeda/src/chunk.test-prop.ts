import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { chunk } from "./chunk";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Up to 30 items: float rounding misplaces a cut only after a dozen items or
// so (size 1.2 drops the 12th item).
const items = fc.oneof(
  fc.array(item, { maxLength: 30, size: "max" }),
  fc.sparseArray(item, { maxLength: 30, size: "max" }),
);

// Whole sizes on both sides of the length; tenths, which unlike random doubles
// are where float rounding misplaces cuts; doubles, which also cover `NaN` and
// `-0`; and the infinities. Sizes under 1 throw.
const chunkSize = fc.oneof(
  fc.integer({ min: -1, max: 32 }),
  fc.integer({ min: -10, max: 40 }).map((tenths) => tenths / 10),
  fc.double({ min: -1, max: 32 }),
  fc.constantFrom(Infinity, -Infinity),
);

// Whole counts only: in `pipe`, `take` rounds a fractional count up and keeps
// everything for `NaN`, while data-first `take` slices.
const takeCount = fc.oneof(
  fc.integer({ min: -1, max: 32 }),
  fc.constant(Infinity),
);

test.prop([items, chunkSize])(
  "data-first and data-last produce the same result",
  (data, size) => {
    // The sizes data-first rejects are covered by the error parity property.
    fc.pre(errorOf(() => chunk(data, size)) === undefined);

    const dataFirst = chunk(data, size);

    expect(isSameChunking(pipe(data, chunk(size)), dataFirst)).toBe(true);
    expect(
      isSameChunking(pipe(data, take(Infinity), chunk(size)), dataFirst),
    ).toBe(true);
  },
);

test.prop([items, takeCount, chunkSize])(
  "a preceding take matches taking first",
  (data, count, size) => {
    fc.pre(errorOf(() => chunk(take(data, count), size)) === undefined);

    expect(
      isSameChunking(
        pipe(data, take(count), chunk(size)),
        chunk(take(data, count), size),
      ),
    ).toBe(true);
  },
);

test.prop([items, chunkSize])(
  "data-last throws what data-first throws",
  (data, size) => {
    const dataFirstError = errorOf(() => chunk(data, size));
    fc.pre(dataFirstError !== undefined);

    // `toStrictEqual` compares the error's class, not only its message.
    expect(errorOf(() => pipe(data, chunk(size)))).toStrictEqual(
      dataFirstError,
    );
    expect(
      errorOf(() => pipe(data, take(Infinity), chunk(size))),
    ).toStrictEqual(dataFirstError);
  },
);

// By identity, position by position: deep equality can't tell the two objects
// apart. A hole compares as `undefined` (the spread fills it in, and `every`
// would otherwise skip it): data-first keeps the holes inside the chunks it
// slices, which a stream of items can't reproduce, and the runtime tests pin
// where it does.
function isSameChunking(
  actual: readonly (readonly unknown[])[],
  expected: readonly (readonly unknown[])[],
): boolean {
  return (
    actual.length === expected.length &&
    expected.every((expectedChunk, index) => {
      const actualChunk = actual[index];
      return (
        actualChunk?.length === expectedChunk.length &&
        [...expectedChunk].every((value, position) =>
          Object.is(value, actualChunk[position]),
        )
      );
    })
  );
}

function errorOf(run: () => unknown): unknown {
  try {
    run();
  } catch (error) {
    return error;
  }
  return undefined;
}
