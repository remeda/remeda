import { switchCase } from './switchCase';
import { pipe } from './pipe';

describe('switchCase', () => {
  test('data-first: with matching case', () => {
    const result = switchCase(
      5,
      {
        1: () => 'first',
        5: () => 'last',
      },
      () => 'not exists'
    );
    expect(result).toEqual('last');
  });

  test('data-first: without matching case', () => {
    const result = switchCase(
      3,
      {
        1: () => 'first',
        5: () => 'last',
      },
      () => 'not exists'
    );
    expect(result).toEqual('not exists');
  });

  test('data-last: with matching case', () => {
    const result = pipe(
      5,
      switchCase(
        {
          1: () => 'first',
          5: () => 'last',
        },
        () => 'not exists'
      )
    );
    expect(result).toEqual('last');
  });

  test('data-last: without matching case', () => {
    const result = pipe(
      3,
      switchCase(
        {
          1: () => 'first',
          5: () => 'last',
        },
        () => 'not exists'
      )
    );
    expect(result).toEqual('not exists');
  });

  test('data-first: with non-string keys', () => {
    const result = switchCase(
      5,
      {
        '2': () => 'even',
        '5': () => 'odd',
      },
      () => 'unknown'
    );
    expect(result).toEqual('odd');
  });

  test('data-last: with non-string keys', () => {
    const result = pipe(
      5,
      switchCase(
        {
          '2': () => 'even',
          '5': () => 'odd',
        },
        () => 'unknown'
      )
    );
    expect(result).toEqual('odd');
  });

  test('data-first: with non-numeric keys', () => {
    const result = switchCase(
      'apple',
      {
        banana: () => 'fruit',
        apple: () => 'fruit too',
      },
      () => 'unknown'
    );
    expect(result).toEqual('fruit too');
  });

  test('data-last: with non-numeric keys', () => {
    const result = pipe(
      'apple',
      switchCase(
        {
          banana: () => 'fruit',
          apple: () => 'fruit too',
        },
        () => 'unknown'
      )
    );
    expect(result).toEqual('fruit too');
  });
});
