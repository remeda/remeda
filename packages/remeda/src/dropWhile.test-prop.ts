import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { dropWhile } from "./dropWhile";
import { pipe } from "./pipe";

test.prop([fc.array(fc.anything()), fc.func(fc.boolean())])(
  "data-first and a fused sequence produce the same result",
  (data, predicateOf) => {
    // The predicate ignores `data`, which differs between the two on purpose:
    // the whole input data-first, the items so far in a fused sequence.
    const predicate = (value: unknown, index: number): boolean =>
      predicateOf(value, index);

    expect(pipe(data, forceFusion(), dropWhile(predicate))).toStrictEqual(
      dropWhile(data, predicate),
    );
  },
);

test.prop([fc.array(fc.anything()), fc.func(fc.boolean())])(
  "data-first and a fused sequence call the predicate the same way",
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
