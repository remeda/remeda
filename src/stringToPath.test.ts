import { stringToPath } from './stringToPath';

test('should convert a string to a deeply nested path', () => {
  const res = stringToPath('a.b[0].c');
  // In TS 4.8 and above, this type will be ['a', 'b', 0, 'c']
  expect<['a', 'b', number, 'c']>(res).toEqual(['a', 'b', 0, 'c']);
});
