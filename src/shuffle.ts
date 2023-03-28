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
  const length = items.length
  
  let index = -1
  const lastIndex = length - 1
  const result = items.slice()
  while (++index < length) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
    const value = result[rand]
    result[rand] = result[index]
    result[index] = value
  }
  return result
}
