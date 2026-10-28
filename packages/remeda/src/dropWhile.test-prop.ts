import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { dropWhile } from "./dropWhile";
import { pipe } from "./pipe";

// Dense only: data-first slices the input, which keeps its holes, while a
// fused run reads each hole as `undefined`.
const items = fc.array(fc.anything());

test.prop([items, fc.func(fc.boolean())])(
  "data-first and data-last produce the same result",
  (data, predicateOf) => {
    // The predicate ignores `data`, which differs between the calling styles
    // on purpose: the whole input data-first, the items so far in `pipe`.
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    expect(pipe(data, dropWhile(predicate))).toStrictEqual(
      dropWhile(data, predicate),
    );
  },
);

test.prop([items, fc.func(fc.boolean())])(
  "data-first and a fused run produce the same result",
  (data, predicateOf) => {
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    expect(pipe(data, forceFusion(), dropWhile(predicate))).toStrictEqual(
      dropWhile(data, predicate),
    );
  },
);

test.prop([items, fc.func(fc.boolean())])(
  "data-first and a fused run call the predicate the same way",
  (data, predicateOf) => {
    const dataFirstCalls: [unknown, number][] = [];
    dropWhile(data, (value, index) => {
      dataFirstCalls.push([value, index]);
      return predicateOf(value, index);
    });

    const fusedCalls: [unknown, number][] = [];
    pipe(
      data,
      forceFusion(),
      dropWhile((value, index) => {
        fusedCalls.push([value, index]);
        return predicateOf(value, index);
      }),
    );

    expect(fusedCalls).toStrictEqual(dataFirstCalls);
  },
);
