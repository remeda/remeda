/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-magic-numbers */

import { bench } from "vitest";
import type { ExactRecord } from "./internal/types/ExactRecord";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";
import { identity } from "./identity";
import { times } from "./times";
import { randomInteger } from "./randomInteger";
import { sample } from "./sample";
import { shuffle } from "./shuffle";
import { constant } from "./constant";

const SYMBOLS = times(100, (i) => Symbol(`sym${i.toString()}`));
const CHARACTERS = [
  // eslint-disable-next-line @typescript-eslint/no-misused-spread
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
];
const REGIONS = ["NA", "EU", "APAC", "LATAM", "MEA", "OCE", "AFRICA", "ARCTIC"];

describe.each([
  {
    name: "groupBy with small arrays",
    array: times(10, identity()),
    grouper: (x: number) => x % 3,
  },
  {
    name: "groupBy with medium arrays",
    array: times(1000, identity()),
    grouper: (x: number) => x % 10,
  },
  {
    name: "groupBy with large arrays",
    array: times(10_000, identity()),
    grouper: (x: number) => x % 100,
  },
  {
    name: "groupBy with few groups",
    array: times(5000, (i) => i % 5),
  },
  {
    name: "groupBy with many groups",
    array: times(10_000, identity()),
  },
  {
    name: "groupBy with string keys",
    array: times(1000, identity()),
    grouper: (x: number) => `key-${(x % 20).toString()}`,
  },
  {
    name: "groupBy with symbol keys",
    array: times(1000, (i) => SYMBOLS[i % SYMBOLS.length]),
  },
  {
    name: "groupBy with problematic property keys",
    array: [
      { key: "__proto__" },
      { key: "constructor" },
      { key: "hasOwnProperty" },
      { key: "" },
      { key: "normal" },
    ],
    grouper: (obj: { readonly key: unknown }) => obj.key,
  },
  {
    name: "users by region (real-world scenario)",
    array: times(5000, (i) => ({
      id: i,
      age: 20 + (i % 50),
      region: sample(REGIONS, 1)[0],
    })),
    grouper: (user: { readonly region: string }) => user.region,
  },
  {
    name: "Random integers, small",
    array: generateRandomIntegers(100),
    grouper: (x: number) => x % 3,
  },
  {
    name: "Random integers, medium",
    array: generateRandomIntegers(1000),
    grouper: (x: number) => x % 10,
  },
  {
    name: "Random integers, large",
    array: generateRandomIntegers(10_000),
    grouper: (x: number) => x % 100,
  },
  {
    name: "Random distribution, few groups",
    array: shuffle(times(5000, (i) => i % 5)),
  },
  {
    name: "Random distribution, many groups",
    array: shuffle(times(10_000, (i) => i % 1000)),
  },
  {
    name: "keys with variable lengths, short",
    array: generateRandomStringKeys(1000, 10).map((key, id) => ({ id, key })),
    grouper: (item: { readonly key: string }) => item.key,
  },
  {
    name: "keys with variable lengths, long",
    array: generateRandomStringKeys(1000, 100).map((key, id) => ({ id, key })),
    grouper: (item: { readonly key: string }) => item.key,
  },
  {
    name: "Random symbol keys",
    array: times(
      1000,
      () =>
        sample(
          times(50, (i) => Symbol(`symbol_${i.toString()}`)),
          1,
        )[0],
    ),
  },
  {
    name: "Random problematic property keys",
    array: times(100, () => ({
      key: sample(
        [
          "__proto__",
          "constructor",
          "hasOwnProperty",
          "toString",
          "valueOf",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "toLocaleString",
          "",
          "length",
          "prototype",
          ...times(20, (i) => `normal${i.toString()}`),
        ],
        1,
      )[0],
    })),
    grouper: (item: { readonly key: string }) => item.key,
  },
  {
    name: "Random realistic data, by region",
    array: generateRandomUsers(5000),
    grouper: (user: { readonly region: string }) => user.region,
  },
  {
    name: "Random realistic data, by age range",
    array: generateRandomUsers(5000),
    grouper: (user: { readonly age: number }) => Math.floor(user.age / 5) * 5,
  },
  {
    name: "mixed data types as keys",
    array: times(1000, (i) => ({
      key: [
        `string-${randomInteger(0, 99).toString()}`,
        randomInteger(0, 99).toString(),
        sample(SYMBOLS, 1)[0],
        randomInteger(0, 1) === 0 ? "y" : "n",
      ][i % 4],
    })),
    grouper: (item: { readonly key: PropertyKey }) => item.key,
  },
  {
    name: "non-contiguous memory access patterns",
    array: times(1000, (i) => ({
      [`prop_${randomInteger(0, 999).toString()}`]: i,
    })),
    grouper: (x: Readonly<Record<string, number>>) => Object.values(x)[0]! % 10,
  },
  {
    name: "Random undefined returns in the callback",
    array: generateRandomIntegers(1000),
    grouper: (x: number) => (Math.random() > 0.3 ? x % 10 : undefined),
  },
])("$name", ({ array, grouper = identity() }) => {
  bench("current", () => {
    // @ts-expect-error [ts2345] -- It's fine...
    groupByImplementation(array, grouper);
  });

  bench("optimized", () => {
    // @ts-expect-error [ts2345] -- It's fine...
    groupByImplementationOptimized(array, grouper);
  });

  bench("alt", () => {
    // @ts-expect-error [ts2345] -- It's fine...
    groupByImplementationAlt(array, grouper);
  });
});

describe("Large data with GC pressure", () => {
  const largeRandomData = generateRandomIntegers(50_000);

  bench("current", () => {
    const temp = times(10_000, () => ({ data: times(100, constant(0)) }));
    if (temp[0].data[0] !== 0) {
      // eslint-disable-next-line no-console
      console.log("Unexpected");
    }

    groupByImplementation(largeRandomData, (x) => x % 100);
  });

  bench("optimized", () => {
    const temp = times(10_000, () => ({ data: times(100, constant(0)) }));
    if (temp[0].data[0] !== 0) {
      // eslint-disable-next-line no-console
      console.log("Unexpected");
    }

    groupByImplementationOptimized(largeRandomData, (x) => x % 100);
  });

  bench("alt", () => {
    const temp = times(10_000, () => ({ data: times(100, constant(0)) }));
    if (temp[0].data[0] !== 0) {
      // eslint-disable-next-line no-console
      console.log("Unexpected");
    }

    groupByImplementationAlt(largeRandomData, (x) => x % 100);
  });
});

describe("Cold start vs warm cache", () => {
  for (let i = 0; i < 3; i++) {
    const freshData = generateRandomIntegers(5000);

    bench(`Run ${(i + 1).toString()} with fresh data - current`, () => {
      groupByImplementation(freshData, (x) => x % 20);
    });

    bench(`Run ${(i + 1).toString()} with fresh data - optimized`, () => {
      groupByImplementationOptimized(freshData, (x) => x % 20);
    });

    bench(`Run ${(i + 1).toString()} with fresh data - alt`, () => {
      groupByImplementationAlt(freshData, (x) => x % 20);
    });
  }
});

const groupByImplementation = <T, Key extends PropertyKey = PropertyKey>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): ExactRecord<Key, NonEmptyArray<T>> => {
  const output = new Map<Key, Array<T>>();

  for (const [index, item] of data.entries()) {
    const key = callbackfn(item, index, data);
    if (key !== undefined) {
      let items = output.get(key);
      if (items === undefined) {
        items = [];
        output.set(key, items);
      }
      items.push(item);
    }
  }

  return Object.fromEntries(output) as ExactRecord<Key, NonEmptyArray<T>>;
};

const groupByImplementationOptimized = <
  T,
  Key extends PropertyKey = PropertyKey,
>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): ExactRecord<Key, NonEmptyArray<T>> => {
  const output = new Map<Key, NonEmptyArray<T>>();

  for (let index = 0; index < data.length; index++) {
    const item = data[index]!;
    const key = callbackfn(item, index, data);
    if (key !== undefined) {
      const items = output.get(key);
      if (items === undefined) {
        output.set(key, [item] as NonEmptyArray<T>);
      } else {
        items.push(item);
      }
    }
  }

  // Only convert to object at the end
  return Object.fromEntries(output.entries()) as ExactRecord<
    Key,
    NonEmptyArray<T>
  >;
};

const groupByImplementationAlt = <T, Key extends PropertyKey = PropertyKey>(
  data: ReadonlyArray<T>,
  callbackfn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => Key | undefined,
): ExactRecord<Key, NonEmptyArray<T>> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const output: ExactRecord<Key, NonEmptyArray<T>> = Object.create(null);

  for (let index = 0; index < data.length; index++) {
    const item = data[index];

    // @ts-expect-error -- See full impl...
    const key = callbackfn(item, index, data);
    if (key !== undefined) {
      const items = output[key];

      if (items === undefined) {
        // @ts-expect-error -- See full impl...
        output[key] = [item];
      } else {
        // @ts-expect-error -- See full impl...
        items.push(item);
      }
    }
  }

  Object.setPrototypeOf(output, Object.prototype);

  return output;
};

function generateRandomIntegers(size: number) {
  return times(size, () => randomInteger(0, 100_000));
}

function generateRandomStringKeys(size: number, keyLength: number) {
  return times(size, () =>
    times(keyLength, () => sample(CHARACTERS, 1)).join(""),
  );
}

function generateRandomUsers(size: number) {
  return times(size, () => ({
    id: randomInteger(1, 1_000_000),
    age: randomInteger(18, 80),
    region: sample(REGIONS, 1)[0],
  }));
}
