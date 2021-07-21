import { purry } from './purry';

function _values<T>(object: { [key: string]: T } | ArrayLike<T>) {
  return Object.values(object) as T[];
}

// data-first
export function values<T>(object: { [key: string]: T } | ArrayLike<T>): T[];

// data-last
export function values<T>(): (
  object: { [key: string]: T } | ArrayLike<T>
) => T[];

export function values() {
  return purry(_values, arguments);
}
