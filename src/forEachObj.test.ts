import { forEachObj } from './forEachObj';
import { pipe } from './pipe';

const obj = {
  a: 1,
  b: 2,
  c: 3,
};

describe('data_first', () => {
  it('forEachObj', () => {
    const cb = jest.fn();
    const result = forEachObj(obj, cb);
    expect(cb.mock.calls).toEqual([[1], [2], [3]]);
    expect(result).toEqual(obj);
  });

  it('forEachObj.indexed', () => {
    const cb = jest.fn();
    const result = forEachObj.indexed(obj, cb);
    expect(cb.mock.calls).toEqual([
      [1, 'a', obj],
      [2, 'b', obj],
      [3, 'c', obj],
    ]);
    expect(result).toEqual(obj);
  });
});

describe('data_last', () => {
  it('forEachObj', () => {
    const cb = jest.fn();
    const result = pipe(obj, forEachObj(cb));
    expect(cb.mock.calls).toEqual([[1], [2], [3]]);
    expect(result).toEqual(obj);
  });

  it('forEachObj.indexed', () => {
    const cb = jest.fn();
    const result = pipe(obj, forEachObj.indexed(cb));
    expect(cb.mock.calls).toEqual([
      [1, 'a', obj],
      [2, 'b', obj],
      [3, 'c', obj],
    ]);
    expect(result).toEqual(obj);
  });
});
