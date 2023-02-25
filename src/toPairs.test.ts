import { toPairs } from './toPairs';
import type { AssertEqual } from './_types';

test('should return pairs', () => {
  const actual = toPairs({ a: 1, b: 2, c: 3 });
  expect(actual).toEqual([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
});

test('should return pairs, strict', () => {
  const actual = toPairs.strict({ a: 1, b: 2, c: 3 });
  expect(actual).toEqual([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
});

test('stricter typing', () => {
  const actual = toPairs.strict({ a: 1, b: 2, c: 3 } as const);
  const isEqual: AssertEqual<
    typeof actual,
    Array<['a' | 'b' | 'c', 1 | 2 | 3]>
  > = true;
  expect(isEqual).toEqual(true);
});

test('stricter typing with optional', () => {
  const actual = toPairs.strict({} as { a?: string });
  const isEqual: AssertEqual<typeof actual, Array<['a', string]>> = true;
  expect(isEqual).toEqual(true);
});

test('stricter typing with undefined', () => {
  const actual = toPairs.strict({ a: undefined } as { a: string | undefined });
  const isEqual: AssertEqual<
    typeof actual,
    Array<['a', string | undefined]>
  > = true;
  expect(isEqual).toEqual(true);
});

test('stricter with a broad type', () => {
  const actual = toPairs.strict({ a: 1, b: 2, c: 3 } as Record<
    string,
    unknown
  >);
  const isEqual: AssertEqual<typeof actual, Array<[string, unknown]>> = true;
  expect(isEqual).toEqual(true);
});
