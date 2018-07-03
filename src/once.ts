export function once(fn: () => void) {
  let called = false;
  return () => {
    if (!called) {
      fn();
      called = true;
    }
  };
}
