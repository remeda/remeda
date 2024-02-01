import { indexBy } from './indexBy';
import { pipe } from './pipe';

const array = [
  { dir: 'left', code: 97 },
  { dir: 'right', code: 100 },
] as const;
const expected = {
  '97': { dir: 'left', code: 97 },
  '100': { dir: 'right', code: 100 },
};
const expectedStrict = {
  97: { dir: 'left', code: 97 },
  100: { dir: 'right', code: 100 },
};
type ExpectedTypeStrict = Partial<
  Record<97 | 100, { dir: 'left' | 'right'; code: 97 | 100 }>
>;

describe('data first', () => {
  test('indexBy', () => {
    expect(indexBy(array, x => x.code)).toEqual(expected);
  });

  test('indexBy.indexed', () => {
    expect(indexBy.indexed(array, x => x.code)).toEqual(expected);
  });

  test('indexBy.strict', () => {
    const result = indexBy.strict(array, x => x.code);
    expectTypeOf<ExpectedTypeStrict>(result);
    expect(result).toStrictEqual(expectedStrict);
  });
});

describe('data last', () => {
  test('indexBy', () => {
    expect(
      pipe(
        array,
        indexBy(x => x.code)
      )
    ).toEqual(expected);
  });

  test('indexBy.indexed', () => {
    expect(
      pipe(
        array,
        indexBy.indexed(x => x.code)
      )
    ).toEqual(expected);
  });

  test('indexBy.strict', () => {
    const result = pipe(
      array,
      indexBy.strict(x => x.code)
    );
    expectTypeOf<ExpectedTypeStrict>(result);
    expect(result).toEqual(expectedStrict);
  });
});
