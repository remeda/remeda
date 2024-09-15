/**
 * Asynchronously sleep. This allows tests to **actually** wait for a specific
 * amount of time. Use this extremely sparingly as it will cause those tests to
 * take **much** longer to run, and would cause our complete test suite to take
 * **much** longer to run, too.
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
