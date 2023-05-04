import { switchCase } from './switchCase';
import { pipe } from './pipe';

describe('switchCase', () => {
  test('data-first: matching case', () => {
    const result = switchCase(
      5,
      { 1: () => 'first', 5: () => 'last' },
      () => 'not exists'
    );
    expect(result).toEqual('last');
  });

  test('data-first: no matching case', () => {
    const result = switchCase(
      3,
      { 1: () => 'first', 5: () => 'last' },
      () => 'not exists'
    );
    expect(result).toEqual('not exists');
  });

  test('data-first: non-string keys', () => {
    const result = switchCase(
      5,
      { '2': () => 'even', '5': () => 'odd' },
      () => 'not exists'
    );
    expect(result).toEqual('odd');
  });

  test('data-first: non-numeric keys', () => {
    const result = switchCase(
      'apple',
      { banana: () => 'fruit', apple: () => 'fruit too' },
      () => 'not exists'
    );
    expect(result).toEqual('fruit too');
  });

  test('data-last: matching case', () => {
    const result = pipe(
      5,
      switchCase({ 1: () => 'first', 5: () => 'last' }, () => 'not exists')
    );
    expect(result).toEqual('last');
  });

  test('data-last: no matching case', () => {
    const result = pipe(
      3,
      switchCase({ 1: () => 'first', 5: () => 'last' }, () => 'not exists')
    );
    expect(result).toEqual('not exists');
  });

  test('data-last: non-string keys', () => {
    const result = pipe(
      5,
      switchCase({ '2': () => 'even', '5': () => 'odd' }, () => 'not exists')
    );
    expect(result).toEqual('odd');
  });

  test('data-last: non-numeric keys', () => {
    const result = pipe(
      'apple',
      switchCase(
        { banana: () => 'fruit', apple: () => 'fruit too' },
        () => 'not exists'
      )
    );
    expect(result).toEqual('fruit too');
  });

  test('R.switchCase: data-last matching case', () => {
    const result = switchCase(
      { 1: () => 'first', 5: () => 'last' },
      () => 'not exists'
    )(5);
    expect(result).toEqual('last');
  });
});
