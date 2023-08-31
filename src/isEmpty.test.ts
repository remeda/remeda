import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  test('returns true for an empty array', () => {
    expect(isEmpty([])).toBe(true);
  });
  test('returns false for a non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  test('returns true for an empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  test('returns false for a non-empty string', () => {
    expect(isEmpty('test')).toBe(false);
  });

  test('returns true for an empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  test('returns false for a non-empty object', () => {
    expect(isEmpty({ length: 0 })).toBe(false);
  });

  test('does not accept invalid input types', () => {
    // @ts-expect-error number is not a valid input type
    isEmpty(2);

    // @ts-expect-error boolean is not a valid input type
    isEmpty(false);

    // @ts-expect-error null is not a valid input type
    isEmpty(null);

    // @ts-expect-error [ts2769] undefined is only allowed with strings
    isEmpty([] as ReadonlyArray<string> | undefined);
  });
});

describe('strings are narrowed correctly', () => {
  test('just undefined', () => {
    const data = undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  test('just string', () => {
    const data = '' as string;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    }
  });

  test('just EMPTY string', () => {
    const data = '' as const;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    }
  });

  test('string or undefined', () => {
    const data = undefined as string | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | undefined>();
    }
  });

  test('string literals that CANT be empty or undefined', () => {
    const data = 'cat' as 'cat' | 'dog';
    if (isEmpty(data)) {
      // unreachable
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test('string literals that CAN be empty', () => {
    const data = 'cat' as 'cat' | 'dog' | '';
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    }
  });

  test('string literals that CAN be undefined', () => {
    const data = 'cat' as 'cat' | 'dog' | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  test('string literals that CAN be undefined or empty', () => {
    const data = 'cat' as 'cat' | 'dog' | '' | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | undefined>();
    }
  });

  test('string templates that CANT be empty or undefined', () => {
    const data = 'prefix_0' as `prefix_${number}`;
    if (isEmpty(data)) {
      // unreachable
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test('string templates that CAN be empty', () => {
    const data = '' as `prefix_${number}` | '';
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    }
  });

  test('string templates that CAN be undefined', () => {
    const data = 'prefix_0' as `prefix_${number}` | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  test('string templates that CAN be undefined or empty', () => {
    const data = 'prefix_0' as `prefix_${number}` | '' | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | undefined>();
    }
  });
});
