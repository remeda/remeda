import { isEqual } from './isEqual';

test('data-first', () => {
  expect(isEqual(2, 2)).toBe(true);
  expect(isEqual('hello', 'hello')).toBe(true);
  expect(isEqual(NaN, NaN)).toBe(true);
  expect(isEqual(null, null)).toBe(true);
  expect(isEqual(undefined, undefined)).toBe(true);

  const symbol = Symbol('hello');
  expect(isEqual(symbol, symbol)).toBe(true);
  // @ts-expect-error these types don't overlap
  expect(isEqual(symbol, Symbol('hello'))).toBe(false);

  const obj = {};
  expect(isEqual(obj, obj)).toBe(true);
  expect(isEqual(obj, {})).toBe(false);

  expect(isEqual(2, 3)).toBe(false);
  // @ts-expect-error these types don't overlap
  expect(isEqual(2 as 2 | 4, 3)).toBe(false);
});

test('data-last', () => {
  expect(isEqual(2)(2)).toBe(true);
  expect(isEqual('hello')('hello')).toBe(true);
  expect(isEqual(NaN)(NaN)).toBe(true);
  expect(isEqual(null)(null)).toBe(true);
  expect(isEqual(undefined)(undefined)).toBe(true);

  const symbol = Symbol('hello');
  expect(isEqual(symbol)(symbol)).toBe(true);
  expect(isEqual(Symbol('hello'))(symbol)).toBe(false);

  const obj = {};
  expect(isEqual(obj)(obj)).toBe(true);
  expect(isEqual({})(obj)).toBe(false);

  expect(isEqual(3)(2)).toBe(false);
});

test('type narrowing', () => {
  const values = [1, 2, 1, 3] as const;
  const result = values.filter(isEqual(1));
  expect(result).toEqual([1, 1]);
  expectTypeOf(result).toEqualTypeOf<Array<1>>();
});
