// TODO: Move out of internal?
export function memoizeIterator<T>(iter: Readonly<Iterator<T>>): Iterable<T> {
  const cache: Array<T> = [];
  let isDone = false;

  return {
    [Symbol.iterator]() {
      let index = 0;
      return {
        next() {
          if (index < cache.length) {
            return { value: cache[index++]! };
          }
          if (isDone) {
            return { done: true, value: undefined };
          }

          const next = iter.next();
          if (next.done === true) {
            isDone = true;
            // Allow iterator to be garbage collected.
            iter = undefined!;
          } else {
            index++;
            cache.push(next.value);
          }
          return next;
        },
      };
    },
  };
}
