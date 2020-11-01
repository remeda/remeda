import { flatMapToObj } from './flatMapToObj';
import { pipe } from './pipe';

describe('data_first', () => {
  it('flatMapToObj', () => {
    const result = flatMapToObj([1, 2, 3] as const, x =>
      x % 2 === 1 ? [[String(x), x]] : []
    );
    expect(result).toEqual({ 1: 1, 3: 3 });
  });
  it('flatMapToObj.indexed', () => {
    const result = flatMapToObj.indexed(['a', 'b'] as const, (x, i) => [
      [x, i],
      [x + x, i + i],
    ]);
    expect(result).toEqual({ a: 0, aa: 0, b: 1, bb: 2 });
  });
});

describe('data_last', () => {
  it('flatMapToObj', () => {
    const result = pipe(
      [1, 2, 3] as const,
      flatMapToObj(x => (x % 2 === 1 ? [[String(x), x]] : []))
    );
    expect(result).toEqual({ 1: 1, 3: 3 });
  });
  it('flatMapToObj.indexed', () => {
    const result = pipe(
      ['a', 'b'] as const,
      flatMapToObj.indexed((x, i) => [
        [x, i],
        [x + x, i + i],
      ])
    );
    expect(result).toEqual({ a: 0, aa: 0, b: 1, bb: 2 });
  });
});
