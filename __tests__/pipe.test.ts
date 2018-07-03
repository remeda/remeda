import { pipe } from '../src/pipe';

it('should pipe a single operation', () => {
  const result = pipe(1, x => x * 2);
  expect(result).toEqual(2);
});

it('should pipe operations', () => {
  const result = pipe(1, x => x * 2, x => x * 3);
  expect(result).toEqual(6);
});
