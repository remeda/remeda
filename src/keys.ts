import { purry } from './purry';

function _keys<T>(object: { [key: string]: T } | ArrayLike<T>) {
  return Object.keys(object) as string[];
}

// data-first
export function keys<T>(object: { [key: string]: T } | ArrayLike<T>): string[];

// data-last
export function keys<T>(): (
  object: { [key: string]: T } | ArrayLike<T>
) => string[];

export function keys() {
  return purry(_keys, arguments);
}
