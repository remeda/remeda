import { invert } from './invert';
import { pipe } from './pipe';

describe('invert', function () {
  describe('with parameter', () => {
    test('empty object', () => {
      expect(invert({})).toEqual({});
    });

    test('no duplicate values', () => {
      expect(invert({ a: 'd', b: 'e', c: 'f' })).toEqual({
        d: 'a',
        e: 'b',
        f: 'c',
      });
    });

    test('duplicate values', () => {
      expect(invert({ a: 'd', b: 'e', c: 'd' })).toEqual({ e: 'b', d: 'c' });
    });

    test('numeric values', () => {
      expect(invert(['a', 'b', 'c'])).toEqual({ a: '0', b: '1', c: '2' });
    });
  });

  describe('without parameter', () => {
    test('empty object', () => {
      expect(pipe({}, invert())).toEqual({});
    });

    test('no duplicate values', () => {
      expect(pipe({ a: 'd', b: 'e', c: 'f' }, invert())).toEqual({
        d: 'a',
        e: 'b',
        f: 'c',
      });
    });

    test('duplicate values', () => {
      expect(pipe({ a: 'd', b: 'e', c: 'd' }, invert())).toEqual({
        e: 'b',
        d: 'c',
      });
    });

    test('numeric values', () => {
      expect(pipe(['a', 'b', 'c'], invert())).toEqual({
        a: '0',
        b: '1',
        c: '2',
      });
    });
  });
});
