// Fixtures, built once per size and shared by every library copy (this module
// is imported without a query, so there is exactly one instance of it).
//
// One User shape everywhere: the shape of `pipe.bench.ts`'s users plus a
// `profile` whose `user` points back at its owner, so a pipe can hop
// `user -> profile -> user` and every step yields an existing object without
// the callback allocating.
//
// Sizes (items per input x distinct inputs per measured call):
//   XS    0, 1 or 3 items (cycling) x 256
//   S     16 x 64
//   C     100 x 64 (the common case)
//   M     1,000 x 1
//   Mx64  1,000 x 64 (calls too cheap to time singly)
//   L     100,000 x 1
//   x64   the S inputs, for scalar / single-object scenarios
//   x1    the first S input
// Batched sizes run the scenario over every input of the batch per measured
// call, and the reported time is per batch.

const ROLES = ["admin", "editor", "viewer"];
const TAG_POOL = ["red", "green", "blue", "yellow", "purple"];
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export const XS_LENGTHS = [0, 1, 3];

export const ITEMS_PER_SIZE = { XS: 4 / 3, S: 16, C: 100, M: 1000, L: 100_000 };

export const BATCH_PER_SIZE = { XS: 256, S: 64, C: 64, Mx64: 64, x64: 64 };

// Kept for the allocation scripts.
export const S_BATCH = BATCH_PER_SIZE.S;

/** Input items processed by one measured call (for per-item figures). */
export function itemsPerCall(size) {
  switch (size) {
    case "XS": {
      return BATCH_PER_SIZE.XS * ITEMS_PER_SIZE.XS;
    }
    case "S":
    case "C": {
      return BATCH_PER_SIZE[size] * ITEMS_PER_SIZE[size];
    }
    case "Mx64": {
      return BATCH_PER_SIZE.Mx64 * ITEMS_PER_SIZE.M;
    }
    case "x64": {
      return BATCH_PER_SIZE.x64;
    }
    case "x1": {
      return 1;
    }
    default: {
      return ITEMS_PER_SIZE[size];
    }
  }
}

// --- Exotic item kinds (G8) ---------------------------------------------------

// Three-level class hierarchy: a miss of `"key" in item` has to walk all of it.
class Entity {
  constructor(id) {
    this.id = id;
  }
}

class Person extends Entity {
  constructor(id, age) {
    super(id);
    this.age = age;
  }
}

class Employee extends Person {
  constructor(id, age, role, isActive) {
    super(id, age);
    this.role = role;
    this.isActive = isActive;
  }
}

// JSON.parse builds fast-mode objects along one transition chain, so every
// 40-key item shares one hidden class (a loop of keyed stores could normalize
// them to dictionary mode instead).
const WIDE_TEMPLATE = JSON.stringify(
  Object.fromEntries([
    ["id", 0],
    ["age", 0],
    ["isActive", false],
    ...Array.from({ length: 37 }, (_, index) => [`field${index}`, index]),
  ]),
);

/** Counts of the pass-through Proxy items' traps, reset by whoever reads it. */
export const TRAP_COUNTS = { has: 0, get: 0 };

const COUNTING_HANDLER = {
  has(target, key) {
    TRAP_COUNTS.has += 1;
    return Reflect.has(target, key);
  },
  get(target, key, receiver) {
    TRAP_COUNTS.get += 1;
    return Reflect.get(target, key, receiver);
  },
};

/** Proxy items, so tracing never inspects them (that would fire their traps). */
export const PROXY_ITEMS = new WeakSet();

// Records keyed by user, one key per item (so an object's "size" is its key
// count), for the object utilities (G7) and entries -> fromEntries (G8).
function buildRecords(users) {
  const record = Object.fromEntries(
    users.map((user) => [`key${user.id}`, user.age]),
  );
  // Up to two keys that are present, for pick / omit / mergeDeep.
  const recordKeys = Object.keys(record).slice(0, 2);
  return {
    record,
    // Equal to `record` but a different object, so isDeepEqual walks it all.
    recordCopy: { ...record },
    recordKeys,
    // One key that overlaps the record (when it has one) and one that doesn't.
    recordPatch: { [recordKeys[0] ?? "keyNone"]: 0, extra: 1 },
    // Every third index, for `difference(range(0, n), used)`.
    usedIndices: users
      .map((_, index) => index)
      .filter((index) => index % 3 === 0),
  };
}

function buildItemKinds(users) {
  return {
    instances: users.map(
      (user) => new Employee(user.id, user.age, user.role, user.isActive),
    ),
    wide: users.map((user) => {
      const item = JSON.parse(WIDE_TEMPLATE);
      item.id = user.id;
      item.age = user.age;
      item.isActive = user.isActive;
      return item;
    }),
    dictionary: users.map((user) => {
      const item = { ...user, scratch: 0 };
      // Deleting a property that isn't the last one added moves the object to
      // dictionary mode.
      delete item.email;
      return item;
    }),
    frozen: users.map((user) => Object.freeze({ ...user })),
    proxies: users.map((user) => {
      const proxy = new Proxy(user, COUNTING_HANDLER);
      PROXY_ITEMS.add(proxy);
      return proxy;
    }),
  };
}

// --- Base data ----------------------------------------------------------------

function buildUsers(count, offset) {
  // About 30% of the emails repeat, at every size, so `unique`-style scenarios
  // have real duplicates to drop.
  const distinctEmails = Math.max(1, Math.ceil(count * 0.7));
  const users = [];
  for (let local = 0; local < count; local++) {
    const index = offset + local;
    const tagCount = 1 + (index % 3);
    const tags = [];
    for (let tag = 0; tag < tagCount; tag++) {
      tags.push(TAG_POOL[(index + tag) % TAG_POOL.length]);
    }
    const profile = { bio: `Bio ${index}`, score: index % 100, user: null };
    const user = {
      id: index,
      name: `User ${index}`,
      email: `user${offset + (local % distinctEmails)}@example.com`,
      age: 16 + (index % 65),
      isActive: index % 5 < 3,
      role: ROLES[index % ROLES.length],
      tags,
      profile,
    };
    profile.user = user;
    users.push(user);
  }
  return users;
}

function buildOrders(count, offset) {
  const orders = [];
  for (let local = 0; local < count; local++) {
    const index = offset + local;
    const itemCount = 1 + (index % 4);
    const items = [];
    for (let item = 0; item < itemCount; item++) {
      const seed = index + item;
      items.push({
        sku: `SKU-${seed % 50}`,
        quantity: 1 + (seed % 5),
        price: 10 + (seed % 90),
      });
    }
    orders.push({ id: index, items });
  }
  return orders;
}

// Inner arrays of 1 to 4 users, `count` users in total.
function buildNested(users) {
  const nested = [];
  let start = 0;
  let group = 0;
  while (start < users.length) {
    const length = 1 + (group % 4);
    nested.push(users.slice(start, start + length));
    start += length;
    group += 1;
  }
  return nested;
}

function buildText(count, offset) {
  const characters = [];
  for (let index = 0; index < count; index++) {
    characters.push(ALPHABET[(index * 7 + offset) % ALPHABET.length]);
  }
  return characters.join("");
}

function evenlySpaced(list, count) {
  const step = Math.max(1, Math.floor(list.length / count));
  const picked = [];
  for (
    let index = 0;
    index < list.length && picked.length < count;
    index += step
  ) {
    picked.push(list[index]);
  }
  return picked;
}

// A stand-in for scenarios that read `d.user` when an XS input is empty.
const FALLBACK_USER = buildUsers(1, -1)[0];

function buildDataset(
  count,
  offset,
  batchIndex,
  { itemKinds = false, records = true } = {},
) {
  const users = buildUsers(count, offset);
  const numbers = users.map((user) => user.age);
  const dataset = {
    users,
    orders: buildOrders(count, offset),
    nested: buildNested(users),
    numbers,
    // Every fourth value is null, for `when(isNullish, ...)`.
    maybeNumbers: numbers.map((value, index) =>
      index % 4 === 1 ? null : value,
    ),
    emails: users.map((user) => user.email),
    idSet: new Set(users.map((user) => user.id)),
    text: buildText(count, offset),
    // Small on purpose: the `*With` utilities are quadratic in it, and the
    // scenarios measure the pipe machinery, not the comparator.
    otherUsers: evenlySpaced(users, count <= 16 ? 2 : 10),
    partnerNumbers: numbers.map((value) => value * 2),
    quarter: Math.floor(count / 4),
    half: Math.floor(count / 2),
    earlyId: users[Math.floor(count * 0.02)]?.id ?? -1,
    middleId: users[Math.floor(count * 0.5)]?.id ?? -1,
    lateId: users[Math.floor(count * 0.98)]?.id ?? -1,
    // Scalar inputs for the non-array scenarios (G3, G7).
    scalar: 17 + batchIndex * 13,
    user: users[0] ?? FALLBACK_USER,
  };
  return {
    ...dataset,
    ...(records ? buildRecords(users) : {}),
    ...(itemKinds ? buildItemKinds(users) : {}),
  };
}

const memo = new Map();

/**
 * The inputs of one measured call: one dataset for M / L / x1, and a batch of
 * distinct datasets for XS / S / C / Mx64 / x64.
 */
export function datasetsFor(size) {
  if (!memo.has(size)) {
    memo.set(size, build(size));
  }
  return memo.get(size);
}

function build(size) {
  switch (size) {
    case "XS": {
      return Array.from({ length: BATCH_PER_SIZE.XS }, (_, batchIndex) =>
        buildDataset(
          XS_LENGTHS[batchIndex % XS_LENGTHS.length],
          batchIndex * 3,
          batchIndex,
        ),
      );
    }
    case "S": {
      return Array.from({ length: BATCH_PER_SIZE.S }, (_, batchIndex) =>
        buildDataset(
          ITEMS_PER_SIZE.S,
          batchIndex * ITEMS_PER_SIZE.S,
          batchIndex,
        ),
      );
    }
    case "C": {
      return Array.from({ length: BATCH_PER_SIZE.C }, (_, batchIndex) =>
        buildDataset(
          ITEMS_PER_SIZE.C,
          batchIndex * ITEMS_PER_SIZE.C,
          batchIndex,
          { itemKinds: true },
        ),
      );
    }
    case "x64": {
      return datasetsFor("S");
    }
    case "x1": {
      return [datasetsFor("S")[0]];
    }
    case "M": {
      return [buildDataset(ITEMS_PER_SIZE.M, 0, 0, { itemKinds: true })];
    }
    case "Mx64": {
      return Array.from({ length: BATCH_PER_SIZE.Mx64 }, (_, batchIndex) =>
        buildDataset(
          ITEMS_PER_SIZE.M,
          batchIndex * ITEMS_PER_SIZE.M,
          batchIndex,
          { records: false },
        ),
      );
    }
    case "L": {
      return [buildDataset(ITEMS_PER_SIZE.L, 0, 0, { records: false })];
    }
    default: {
      throw new Error(`Unknown size ${size}`);
    }
  }
}
