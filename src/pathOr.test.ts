import { pathOr } from './pathOr';
import { pipe } from './pipe';

interface SampleType {
  a: {
    b: {
      c: number;
      d?: number;
    };
    z?: number;
  };
  x?: number;
  y?: number;
}

const obj: SampleType = {
  a: {
    b: {
      c: 1,
    },
  },
  y: 10,
};

describe('data first', () => {
  test('should return default value (input undefined)', () => {
    type MaybeSampleType = SampleType | undefined;
    expect(pathOr(undefined as MaybeSampleType, ['x'], 2)).toEqual(2);
  });

  test('should return value', () => {
    expect(pathOr(obj, ['y'] as const, 2)).toEqual(10);
  });

  test('should return default value', () => {
    expect(pathOr(obj, ['x'] as const, 2)).toEqual(2);
  });

  test('should return value (2 level deep)', () => {
    expect(pathOr(obj, ['a', 'b'] as const, { c: 0 })).toEqual({ c: 1 });
  });

  test('should return default value (2 level deep)', () => {
    expect(pathOr(obj, ['a', 'z'] as const, 3)).toEqual(3);
  });

  test('should return value (3 level deep)', () => {
    // TODO: fix typing
    // @ts-ignore
    expect(pathOr(obj, ['a', 'b', 'c'] as const, 0)).toEqual(1);
  });
});

describe('data last', () => {
  test('1 level', () => {
    expect(pipe(obj, pathOr(['x'], 1))).toEqual(1);
  });
  test('2 level', () => {
    expect(pipe(obj, pathOr(['a', 'z'], 1))).toEqual(1);
  });
  test('3 level', () => {
    // @ts-ignore
    expect(pipe(obj, pathOr(['a', 'b', 'd'] as const, 1))).toEqual(1);
  });
});
