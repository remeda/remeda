export class TestClass {
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style, @typescript-eslint/class-methods-use-this -- This is fine for a test (I hope...)
  public get foo(): string {
    return "a";
  }
}

export const TYPES_DATA_PROVIDER = {
  array: [1, 2, 3] as Array<number>,
  bigint: 1n,
  boolean: false as boolean,
  date: new Date("1985-07-24T07:40:00.000Z"),
  error: new Error("asd"),
  function: () => {
    /* (intentionally empty) */
  },
  instance: new TestClass(),
  map: new Map<string, string>(),
  null: null,
  number: 5 as number,
  object: { a: "asd" },
  promise: Promise.resolve(5),
  regex: /test/gu,
  set: new Set<string>(),
  string: "text" as string,
  symbol: Symbol("symbol"),
  tuple: [1, 2, 3] as [number, number, number],
  typedArray: new Uint8Array(1),
  undefined,
} as const;

export const ALL_TYPES_DATA_PROVIDER = Object.values(TYPES_DATA_PROVIDER);
export type AllTypesDataProviderTypes =
  (typeof ALL_TYPES_DATA_PROVIDER)[number];
