import { debounce } from './debounce';
import { identity } from './identity';

describe('Main functionality', () => {
  it('should debounce a function', async () => {
    let callCount = 0;

    const debouncer = debounce(
      value => {
        callCount += 1;
        return value;
      },
      { waitMs: 32 }
    );

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
    const debouncer = debounce(identity, { waitMs: 32 });
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
    });

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
      { waitMs: 32 }
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
      { waitMs: 32, timing: 'leading' }
    );

    withLeading.call();
    expect(callCounts.leading).toBe(1);

    const withLeadingAndTrailing = debounce(
      () => {
        callCounts.both++;
      },
      { waitMs: 32, timing: 'both' }
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
    const debouncer = debounce(identity, { waitMs: 32, timing: 'leading' });

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
      { waitMs: 32, timing: 'trailing' }
    );

    withTrailing.call();
    expect(withCount).toBe(0);

    await sleep(64);
    expect(withCount).toBe(1);
  });
});

describe('Optional param maxWaitMs', () => {
  it('should support a `maxWait` option', async () => {
    let callCount = 0;

    const debouncer = debounce(
      value => {
        ++callCount;
        return value;
      },
      { waitMs: 32, maxWaitMs: 64 }
    );

    debouncer.call('a');
    debouncer.call('b');
    expect(callCount).toBe(0);

    await sleep(128);
    expect(callCount).toBe(1);
    debouncer.call('c');
    debouncer.call('d');
    expect(callCount).toBe(1);

    await sleep(256);
    expect(callCount).toBe(2);
  });

  it('should support `maxWait` in a tight loop', async () => {
    let withCount = 0;
    let withoutCount = 0;

    const withMaxWait = debounce(
      () => {
        withCount++;
      },
      { waitMs: 32, maxWaitMs: 128 }
    );

    const withoutMaxWait = debounce(
      () => {
        withoutCount++;
      },
      { waitMs: 96 }
    );

    const start = Date.now();
    while (Date.now() - start < 320) {
      withMaxWait.call();
      withoutMaxWait.call();
    }

    await sleep(1);
    expect(withoutCount).toBe(0);
    expect(withCount).toBeGreaterThan(0);
  });

  it('should queue a trailing call for subsequent debounced calls after `maxWait`', async () => {
    let callCount = 0;

    const debouncer = debounce(
      () => {
        ++callCount;
      },
      { waitMs: 200, maxWaitMs: 200 }
    );

    debouncer.call();

    setTimeout(() => {
      debouncer.call();
    }, 190);
    setTimeout(() => {
      debouncer.call();
    }, 200);
    setTimeout(() => {
      debouncer.call();
    }, 210);

    await sleep(500);
    expect(callCount).toBe(2);
  });

  it('should cancel `maxDelayed` when `delayed` is invoked', async () => {
    let callCount = 0;

    const debouncer = debounce(
      () => {
        callCount++;
      },
      { waitMs: 32, maxWaitMs: 64 }
    );

    debouncer.call();

    await sleep(128);
    debouncer.call();
    expect(callCount).toBe(1);

    await sleep(192);
    expect(callCount).toBe(2);
  });
});

describe('Additional functionality', () => {
  it('can cancel before the timer starts', async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(() => debouncer.cancel()).not.toThrow();

    expect(debouncer.call('hello')).toBeUndefined();
    await sleep(32);

    expect(debouncer.call('world')).toEqual('hello');
  });

  it('can cancel the timer', async () => {
    let count = 0;
    const debouncer = debounce(
      () => {
        count += 1;
        return 'hello World';
      },
      { waitMs: 32 }
    );

    expect(debouncer.call()).toBeUndefined();
    expect(count).toEqual(0);

    await sleep(1);
    expect(debouncer.call()).toBeUndefined();
    expect(count).toEqual(0);
    debouncer.cancel();

    await sleep(32);
    expect(debouncer.call()).toBeUndefined();
    expect(count).toEqual(0);

    await sleep(32);
    expect(debouncer.call()).toEqual('hello World');
    expect(count).toEqual(1);
  });

  it('can cancel after the timer ends', async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.call('hello')).toBeUndefined();
    await sleep(32);

    expect(debouncer.call('world')).toEqual('hello');
    expect(() => debouncer.cancel()).not.toThrow();
  });

  it('can return a cached value', () => {
    const debouncer = debounce(identity, { timing: 'leading', waitMs: 32 });
    expect(debouncer.cachedValue).toBeUndefined();
    expect(debouncer.call('hello')).toEqual('hello');
    expect(debouncer.cachedValue).toEqual('hello');
  });

  it('can check for inflight timers (trailing)', async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.isPending).toEqual(false);

    expect(debouncer.call('hello')).toBeUndefined();
    expect(debouncer.isPending).toEqual(true);

    await sleep(1);
    expect(debouncer.isPending).toEqual(true);

    await sleep(32);
    expect(debouncer.isPending).toEqual(false);
  });

  it('can check for inflight timers (trailing)', async () => {
    const debouncer = debounce(identity, { timing: 'leading', waitMs: 32 });
    expect(debouncer.isPending).toEqual(false);

    expect(debouncer.call('hello')).toEqual('hello');
    expect(debouncer.isPending).toEqual(true);

    await sleep(1);
    expect(debouncer.isPending).toEqual(true);

    await sleep(32);
    expect(debouncer.isPending).toEqual(false);
  });

  it('can flush before a cool-down', async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.flush()).toBeUndefined();

    expect(debouncer.call('hello')).toBeUndefined();
    await sleep(32);

    expect(debouncer.call('world')).toEqual('hello');
  });

  it('can flush during a cool-down', async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.call('hello')).toBeUndefined();

    await sleep(1);
    expect(debouncer.call('world')).toBeUndefined();

    await sleep(1);
    expect(debouncer.flush()).toEqual('world');
  });

  it('can flush after a cool-down', async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.call('hello')).toBeUndefined();

    await sleep(32);
    expect(debouncer.flush()).toEqual('hello');
  });
});

describe('typing', () => {
  it("returns undefined on 'trailing' timing", () => {
    const debouncer = debounce(() => 'Hello, World!', {
      waitMs: 32,
      timing: 'trailing',
    });
    const result = debouncer.call();
    expectTypeOf(result).toEqualTypeOf<string | undefined>();
  });

  it("doesn't return undefined on 'leading' timing", () => {
    const debouncer = debounce(() => 'Hello, World!', {
      waitMs: 32,
      timing: 'leading',
    });
    const result = debouncer.call();
    expectTypeOf(result).toEqualTypeOf<string>();
  });

  it("doesn't return undefined on 'both' timing", () => {
    const debouncer = debounce(() => 'Hello, World!', {
      waitMs: 32,
      timing: 'both',
    });
    const result = debouncer.call();
    expectTypeOf(result).toEqualTypeOf<string>();
  });

  test('argument typing to be good (all required)', () => {
    const debouncer = debounce(
      (a: string, b: number, c: boolean) => `${a}${b}${c}`
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
      (a: string, b?: number, c?: boolean) => `${a}${b}${c}`
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
      (a: string, b: number = 2, c: boolean = true) => `${a}${b}${c}`
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
