import { cond } from './cond';
import { pipe } from './pipe';

describe('data first', () => {
  test('should return value of first pair', () => {
    const value = cond('Jokic', [
      [s => s === 'Murray', s => 'point guard'],
      [s => s === 'Jokic', s => 'center'],
      [s => s === 'Jokic', s => 'mvp'],
    ]);
    expect(value).toBe('center');
  });

  test('should return undefined if none match', () => {
    const value = cond('Jokic', [[s => s === 'Murray', s => 'point guard']]);
    expect(value).toBeUndefined();
  });
});

describe('data last', () => {
  test('should return value of first pair', () => {
    const value = pipe(
      'Jokic',
      cond([
        [s => s === 'Murray', s => 'point guard'],
        [s => s === 'Jokic', s => 'center'],
        [s => s === 'Jokic', s => 'mvp'],
      ])
    );
    expect(value).toBe('center');
  });
});
