import { stringToPath } from './stringToPath';

test('should convert a string to a deeply nested path', () => {
  expect<['a', 'b', '0', 'c']>(stringToPath('a.b[0].c')).toEqual([
    'a',
    'b',
    '0',
    'c',
  ]);
});
