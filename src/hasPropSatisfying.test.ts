import { filter } from './filter';
import { hasPropSatisfying } from './hasPropSatisfying';
import { isEqual } from './isEqual';
import { isNil } from './isNil';
import { isNumber } from './isNumber';
import { isString } from './isString';
import { pipe } from './pipe';

const obj = { a: 1, b: undefined, 1: 'hi', d: 1 } as
  | { a: number; b?: number | undefined; d: number }
  | { c: number; 1: string; d?: string };

test('data-first', () => {
  expect(hasPropSatisfying(obj, 'a', isEqual(1))).toBe(true);
  expect(hasPropSatisfying(obj, 'a', isEqual(2))).toBe(false);
  expect(hasPropSatisfying(obj, 'b', isNumber)).toBe(false);
  expect(hasPropSatisfying(obj, 'c', isEqual(2))).toBe(false);
  expect(hasPropSatisfying(obj, 'd', isNumber)).toBe(true);
  expect(hasPropSatisfying(obj, 1, isEqual('hi'))).toBe(true);
  expect(hasPropSatisfying(obj, 1, isEqual('bye'))).toBe(false);

  const tuple = [0] as const;
  expect(hasPropSatisfying(tuple, 0, isEqual(0))).toBe(true);
  // @ts-expect-error 1 is not assignable to 0
  expect(hasPropSatisfying(tuple, 0, isEqual(1))).toBe(false);
  // @ts-expect-error this element is not present
  expect(hasPropSatisfying(tuple, 1, isEqual(0))).toBe(false);

  const arr = [0];
  expect(hasPropSatisfying(arr, 0, isEqual(0))).toBe(true);
  expect(hasPropSatisfying(arr, 1, isEqual(0))).toBe(false);
});

test('data-last', () => {
  expect(pipe(obj, hasPropSatisfying('a', isNumber))).toBe(true);
  expect(pipe(obj, hasPropSatisfying('b', isNumber))).toBe(false);
  expect(pipe(obj, hasPropSatisfying('c', isNumber))).toBe(false);
  expect(pipe(obj, hasPropSatisfying(1, isString))).toBe(true);
  expect(pipe(obj, hasPropSatisfying('d', isNumber))).toBe(true);

  // @ts-expect-error the prop `1` is not a number
  expect(pipe(obj, hasPropSatisfying(1, isNumber))).toBe(false);
  // @ts-expect-error this property does not exist
  expect(pipe(obj, hasPropSatisfying(2, isNumber))).toBe(false);
});

test('predicate argument type narrowing', () => {
  hasPropSatisfying(obj, 'b', (val): val is 1 => {
    // When typescript removes the optionality of a prop, it also removes the undefined type.
    // https://github.com/microsoft/TypeScript/issues/31025
    expectTypeOf(val).toEqualTypeOf<number>();
    return true;
  });
  hasPropSatisfying(obj, 'a', (val): val is 1 => {
    expectTypeOf(val).toEqualTypeOf<number>();
    return true;
  });
  hasPropSatisfying(obj, 'c', (val): val is 1 => {
    expectTypeOf(val).toEqualTypeOf<number>();
    return true;
  });
  hasPropSatisfying(obj, 1, (val): val is 'hi' => {
    expectTypeOf(val).toEqualTypeOf<string>();
    return true;
  });
  hasPropSatisfying(obj, 'd', (val): val is 'hi' => {
    expectTypeOf(val).toEqualTypeOf<string | number>();
    return true;
  });
  hasPropSatisfying([0], 0, (val): val is 0 => {
    expectTypeOf(val).toEqualTypeOf<number>();
    return true;
  });
  hasPropSatisfying([0] as const, 0, (val): val is 0 => {
    expectTypeOf(val).toEqualTypeOf<0>();
    return true;
  });
});

test('type-narrowing', () => {
  if (hasPropSatisfying(obj, 'a', isEqual(1))) {
    expectTypeOf(obj).toEqualTypeOf<{
      a: 1;
      b?: number | undefined;
      d: number;
    }>();
  }

  if (hasPropSatisfying(obj, 'b', isEqual(2))) {
    expectTypeOf(obj).toEqualTypeOf<{ a: number; b: 2; d: number }>();
  }

  if (hasPropSatisfying(obj, 'b', isNil)) {
    expectTypeOf(obj).toEqualTypeOf<{ a: number; b: never; d: number }>();
  }

  if (hasPropSatisfying(obj, 'c', isEqual(2))) {
    expectTypeOf(obj).toEqualTypeOf<{
      c: 2;
      1: string;
      d?: string | undefined;
    }>();
  }

  if (hasPropSatisfying(obj, 'd', isEqual(2))) {
    expectTypeOf(obj).toEqualTypeOf<{
      a: number;
      b?: number | undefined;
      d: 2;
    }>();
  }

  if (hasPropSatisfying(obj, 1, isEqual('hi'))) {
    expectTypeOf(obj).toEqualTypeOf<{
      c: number;
      1: 'hi';
      d?: string | undefined;
    }>();
  }
});

test('array filter type narrowing', () => {
  type CompletedTodo = { type: 'completed'; completedReason: string };
  type CancelledTodo = { type: 'cancelled'; cancelledReason: string };
  type TodoItem = CompletedTodo | CancelledTodo;
  const todos = [
    { type: 'completed', completedReason: 'done' },
  ] as Array<TodoItem>;

  const completedItems = todos.filter(
    hasPropSatisfying('type', isEqual('completed'))
  );
  const completedItem = completedItems[0];
  expectTypeOf(completedItem).toEqualTypeOf<CompletedTodo>();

  const cancelledItems = pipe(
    todos,
    filter(hasPropSatisfying('type', isEqual('cancelled')))
  );
  const cancelledItem = cancelledItems[0];
  expectTypeOf(cancelledItem).toEqualTypeOf<CancelledTodo>();
});
