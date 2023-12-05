import { debounce } from './debounce';
import { identity } from './identity';

describe('runtime', () => {
  it('should debounce a function', async () => {
    let callCount = 0;

    const debouncer = debounce(value => {
      callCount += 1;
      return value;
    }, 32);

    expect([
      debouncer.call('a'),
      debouncer.call('b'),
      debouncer.call('c'),
    ]).toEqual([undefined, undefined, undefined]);
    expect(callCount).toBe(0);

    await sleep(128);

    expect(callCount).toBe(1);
    expect([
      debouncer.call('d'),
      debouncer.call('e'),
      debouncer.call('f'),
    ]).toEqual(['c', 'c', 'c']);
    expect(callCount).toBe(1);

    await sleep(256);

    expect(callCount).toBe(2);
  });

  it('subsequent debounced calls return the last `func` result', async () => {
    const debouncer = debounce(identity, 32);
    debouncer.call('a');

    await sleep(64);
    expect(debouncer.call('b')).toEqual('a');

    await sleep(128);
    expect(debouncer.call('c')).toEqual('b');
  });

  it('should not immediately call `func` when `wait` is `0`', async () => {
    let callCount = 0;
    const debouncer = debounce(() => {
      ++callCount;
    }, 0);

    debouncer.call();
    debouncer.call();
    expect(callCount).toBe(0);

    await sleep(5);
    expect(callCount).toBe(1);
  });

  it('should apply default options', async () => {
    let callCount = 0;
    const debouncer = debounce(
      () => {
        callCount++;
      },
      32,
      {}
    );

    debouncer.call();
    expect(callCount).toBe(0);

    await sleep(64);
    expect(callCount).toBe(1);
  });

  it('should support a `leading` option', async () => {
    const callCounts = { leading: 0, both: 0 };

    const withLeading = debounce(
      () => {
        callCounts.leading++;
      },
      32,
      { timing: 'leading' }
    );

    withLeading.call();
    expect(callCounts.leading).toBe(1);

    const withLeadingAndTrailing = debounce(
      () => {
        callCounts.both++;
      },
      32,
      { timing: 'both' }
    );

    withLeadingAndTrailing.call();
    withLeadingAndTrailing.call();
    expect(callCounts.both).toBe(1);

    await sleep(64);
    expect(callCounts.both).toEqual(2);

    withLeading.call();
    expect(callCounts.leading).toBe(2);
  });

  it('subsequent leading debounced calls return the last `func` result', async () => {
    const debouncer = debounce(identity, 32, { timing: 'leading' });

    expect([debouncer.call('a'), debouncer.call('b')]).toEqual(['a', 'a']);

    await sleep(64);
    expect([debouncer.call('c'), debouncer.call('d')]).toEqual(['c', 'c']);
  });

  it('should support a `trailing` option', async () => {
    let withCount = 0;

    const withTrailing = debounce(
      () => {
        withCount++;
      },
      32,
      { timing: 'trailing' }
    );

    withTrailing.call();
    expect(withCount).toBe(0);

    await sleep(64);
    expect(withCount).toBe(1);
  });
});

describe('typing', () => {
  test('argument typing to be good (all required)', () => {
    const debouncer = debounce(
      (a: string, b: number, c: boolean) => `${a}${b}${c}`,
      32
    );
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 0.
    debouncer.call();
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
    debouncer.call('a');
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 2.
    debouncer.call('a', 1);

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true, 1, true);

    // All good
    debouncer.call('a', 1, true);
  });

  test('argument typing to be good (with optional)', () => {
    const debouncer = debounce(
      (a: string, b?: number, c?: boolean) => `${a}${b}${c}`,
      32
    );
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
    debouncer.call();

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true, 1, true);

    // All good
    debouncer.call('a');
    debouncer.call('a', 1);
    debouncer.call('a', 1, true);
  });

  test('argument typing to be good (with defaults)', () => {
    const debouncer = debounce(
      (a: string, b: number = 2, c: boolean = true) => `${a}${b}${c}`,
      32
    );
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
    debouncer.call();

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true, 1, true);

    // All good
    debouncer.call('a');
    debouncer.call('a', 1);
    debouncer.call('a', 1, true);
  });

  test('argument typing to be good (with rest param)', async () => {
    const debouncer = debounce(
      (a: string, ...flags: ReadonlyArray<boolean>) =>
        `${a}${flags.map(flag => (flag ? 'y' : 'n')).join()}`,
      32,
      { timing: 'leading' }
    );
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
    debouncer.call();

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true);

    // @ts-expect-error [ts2354]: string instead of boolean
    debouncer.call('a', 'b');

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true, 'b');

    // All good
    debouncer.call('a');
    debouncer.call('a', true);
    debouncer.call('a', true, false);

    await sleep(64);

    expect(
      debouncer.call('a', true, true, false, false, true, false, true)
    ).toEqual('ay,y,n,n,y,n,y');
  });
});

async function sleep(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}
