import { purry } from './purry';

export interface SampleType {
  size: number;
  repeating: boolean;
}

function _sample<T>(items: Array<T>, options: number | SampleType) {
  let nbrSamples = typeof options === 'number' ? options : options.size;
  const repeating = typeof options === 'object' && options?.repeating;

  let size = items.length;
  items = [...items];

  if (nbrSamples > size && !repeating) nbrSamples = size;

  const sample = [];

  for (let i = 0; i < nbrSamples; i++) {
    const index = Math.floor(Math.random() * size);
    const value = items[index];
    sample.push(value);
    if (!repeating) {
      items[index] = items[size - 1];
      size--;
    }
  }

  return sample;
}

/**
 * Returns random elements of the array.
 * @param items the array
 * @param options The number of samples to take. If the same item can be
 * picked multiple times, you can pass the object `{ size: number, repeating: boolean }`.
 * If the number of samples to return exceeds the array size, and `repeating`
 * is false, returns a number of sample equals to the size of the array.
 * @signature
 *    R.sample(array,size)
 *    R.sample(array, {size, repeating})
 * @example
 * R.repeat([1,2,3,4],2); // [3,1]
 * R.repeat([1,2,3,4],{size:5, repeating: true}); // [3,1,2,2,4]
 * R.repeat([1,2,3,4],{size:5, repeating: false}); // [3,1,2,4]
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.sumBy(x => x.a)
 *    ) // 9
 * @data_first
 * @category Array
 */
export function sample<T>(items: ReadonlyArray<T>, size: number): Array<T>;
export function sample<T>(items: ReadonlyArray<T>, options: SampleType): Array<T>;

/**
 * Returns random elements of the array.
 * @param options The number of samples to take. If the same item can be
 * picked multiple times, you can pass the object `{ size: number, repeating: boolean }`.
 * If the number of samples to return exceeds the array size, and `repeating`
 * is false, returns a number of sample equals to the size of the array.
 * @signature
 *    R.sample(size)(array)
 *    R.sample({size, repeating})(array)
 * @example
 * R.repeat(2)([1,2,3,4]); // [3,1]
 * R.repeat({size:5, repeating: true},[1,2,3,4]); // [3,1,2,2,4]
 * R.repeat({size:5, repeating: false},[1,2,3,4]); // [3,1,2,4]
 * @data_last
 * @category Array
 */
export function sample(size: number): <T>(items: Array<T>) => Array<T>;
export function sample(options: SampleType): <T>(items: Array<T>) => Array<T>;

export function sample() {
  return purry(_sample, arguments);
}
