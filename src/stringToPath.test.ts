import { stringToPath } from './stringToPath';

test('should convert a string to a deeply nested path', () => {
  const res = stringToPath('a.b[0].c');
  expect<['a', 'b', '0', 'c']>(res).toEqual(['a', 'b', '0', 'c']);
});
