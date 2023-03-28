/**
 * Creates an array of shuffled values, using the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 * @param items the array to shuffle
 * @signature
 *    R.shuffle(array)
 * @example
 *    R.shuffle(['one', 'two', 'three']) // => ['two', 'three', 'one']
 * @category Array
 */
export function shuffle<T>(items: ReadonlyArray<T>): Array<T> {
  const result = items.slice()
  for (let index = 0; index < items.length; index += 1) {
    const rand = index + Math.floor(Math.random() * (items.length - index))
    const value = result[rand]
    result[rand] = result[index]
    result[index] = value
  }
  return result
}
