/**
 * Asynchronously sleep. This allows tests to **actually** wait for a specific
 * amount of time. Use this extremely sparingly as it will cause those tests to
 * take **much** longer to run, and would cause our complete test suite to take
 * **much** longer to run, too.
 *
 * @param ms - The number of milliseconds to sleep.
 * @example
 *   await sleep(1000); // Wait for 1 second.
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
