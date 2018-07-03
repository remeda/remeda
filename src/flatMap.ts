import { flatten } from './flatten';

export function flatMap<T, K>(array: T[], fn: (input: T) => K | K[]): K[];

export function flatMap<T, K>(fn: (input: T) => K | K[]): (array: T[]) => K[];

export function flatMap(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any[]) => {
      return _flatMap(data, arg1);
    };
  }
  return _flatMap(arg1, arg2);
}

function _flatMap<T, K>(array: T[], fn: (input: T) => K[]): K[] {
  return flatten(array.map(item => fn(item)));
}
