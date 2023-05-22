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

    // @ts-expect-error undefined is not a valid input type
    isEmpty(undefined);
  });
});
