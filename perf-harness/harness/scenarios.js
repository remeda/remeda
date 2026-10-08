// Scenario definitions. This module is imported once per library copy (and
// once for the native baselines) with a distinct `?instance=` query, so every
// copy gets its own instances of the functions below. V8 shares one feedback
// vector between all closures created from the same function literal by the
// same enclosing closure, so if `body(main)` and `body(branch)` came from one
// literal their `pipe(...)` call sites would go polymorphic over both
// libraries and the numbers would depend on which library ran first.
//
// Each scenario is `{ group, id, sizes, body, native?, kind, main, tags? }`:
//   body:   (lib) => (dataset) => result   the identical call shape for every
//                                           library copy
//   native: (dataset) => result            hand-written equivalent
//   kind:   the shape class that sets the scenario's tier (harness/tiers.js)
//   main:   the utility the scenario is about; its popularity can lower the
//           tier
// Callbacks are written inline in the bodies, as users write them, so they
// are allocated on every call for every copy alike.
//
// This module must not import anything: under Bun (which ignores the
// `?instance=` query) the registry loads per-copy physical copies of it from
// another directory.

export const SCENARIOS = [];

// Short lazy pipes: XS / S / C are tier 1, M tier 2, L tier 3.
const PIPE_SIZES = ["XS", "S", "C", "M", "L"];
// Scenarios that only make sense at C and above (early exits, `take(10)`).
const CML = ["C", "M", "L"];
const UP_TO_M = ["XS", "S", "C", "M"];
const SML = ["S", "M", "L"];
const SM = ["S", "M"];
const CM = ["C", "M"];
const SCALAR = ["x64", "x1"];

// Scenarios that guard the data-first (and direct data-last) call paths; the
// aggregation reports them in their own section.
const GUARD = ["data-first-guard"];
// The headline scenarios (subset H), used by the one-copy-per-process
// cross-check.
const HEADLINE = ["headline"];
// Scenarios over the pass-through Proxy items; validation reports their trap
// counts per copy.
const TRAPS = ["traps"];

function scenario(group, id, sizes, body, native, extra) {
  if (extra?.kind === undefined || extra.main === undefined) {
    throw new Error(`Scenario ${group} ${id} needs a kind and a main utility`);
  }
  SCENARIOS.push({ group, id, sizes, body, native, ...extra });
}

// `kind` + `main` shorthands.
const lazyShort = (main, tags) => ({ kind: "lazy-short", main, tags });

// Side-effect target for `forEach` callbacks.
const effects = { value: 0 };

function* iterate(list) {
  for (const item of list) {
    yield item;
  }
}

/**
 * Wraps a `(dataset) => result` function into the measured closure. Batched
 * sizes run the whole batch per call and report the per-batch time.
 */
export function makeMeasured(run, datasets) {
  if (datasets.length === 1) {
    const [dataset] = datasets;
    return () => run(dataset);
  }
  const results = Array.from({ length: datasets.length });
  return () => {
    for (let index = 0; index < datasets.length; index++) {
      results[index] = run(datasets[index]);
    }
    return results;
  };
}

/**
 * `makeMeasured` with a hook before every input of the batch, for validation
 * tracing (kept separate so the measured closures carry no hook check).
 */
export function makeMeasuredWithHook(run, datasets, beforeEach) {
  return () => {
    const results = [];
    for (let index = 0; index < datasets.length; index++) {
      beforeEach(index);
      results.push(run(datasets[index]));
    }
    return datasets.length === 1 ? results[0] : results;
  };
}

function groupByRole(users) {
  const grouped = {};
  for (const user of users) {
    (grouped[user.role] ??= []).push(user);
  }
  return grouped;
}

function uniqueByEmail(users) {
  const seen = new Set();
  const result = [];
  for (const user of users) {
    if (!seen.has(user.email)) {
      seen.add(user.email);
      result.push(user);
    }
  }
  return result;
}

// ===========================================================================
// G1: lazy pipe shapes
// ===========================================================================

scenario(
  "G1",
  "map",
  PIPE_SIZES,
  ({ pipe, map }) =>
    (d) =>
      pipe(
        d.users,
        map((user) => user.name),
      ),
  (d) => d.users.map((user) => user.name),
  lazyShort("map", HEADLINE),
);

// `data[index]` is the current item both in a lazy pipe (where `data` is the
// prefix seen so far) and natively, so all copies must agree on the output.
scenario(
  "G1",
  "map reading data",
  PIPE_SIZES,
  ({ pipe, map }) =>
    (d) =>
      pipe(
        d.users,
        map((user, index, data) => data[index].age + user.id),
      ),
  (d) => d.users.map((user, index, data) => data[index].age + user.id),
  lazyShort("map"),
);

scenario(
  "G1",
  "filter+map",
  PIPE_SIZES,
  ({ pipe, filter, map }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.isActive),
        map((user) => user.name),
      ),
  (d) => d.users.filter((user) => user.isActive).map((user) => user.name),
  lazyShort("filter", HEADLINE),
);

scenario(
  "G1",
  "map+filter+map",
  PIPE_SIZES,
  ({ pipe, filter, map }) =>
    (d) =>
      pipe(
        d.users,
        map((user) => user.age),
        filter((age) => age >= 18),
        map((age) => age * 12),
      ),
  (d) =>
    d.users
      .map((user) => user.age)
      .filter((age) => age >= 18)
      .map((age) => age * 12),
  lazyShort("map", HEADLINE),
);

scenario(
  "G1",
  "flatMap+filter+map",
  PIPE_SIZES,
  ({ pipe, flatMap, filter, map }) =>
    (d) =>
      pipe(
        d.orders,
        flatMap((order) => order.items),
        filter((item) => item.quantity > 1),
        map((item) => item.price * item.quantity),
      ),
  (d) =>
    d.orders
      .flatMap((order) => order.items)
      .filter((item) => item.quantity > 1)
      .map((item) => item.price * item.quantity),
  lazyShort("flatMap"),
);

scenario(
  "G1",
  "flat+map",
  PIPE_SIZES,
  ({ pipe, flat, map }) =>
    (d) =>
      pipe(
        d.nested,
        flat(),
        map((user) => user.name),
      ),
  (d) => d.nested.flat().map((user) => user.name),
  lazyShort("flat"),
);

scenario(
  "G1",
  "drop+take",
  PIPE_SIZES,
  ({ pipe, drop, take }) =>
    (d) =>
      pipe(d.users, drop(d.quarter), take(d.half)),
  (d) => d.users.slice(d.quarter, d.quarter + d.half),
  lazyShort("drop"),
);

scenario(
  "G1",
  "map+unique",
  PIPE_SIZES,
  ({ pipe, map, unique }) =>
    (d) =>
      pipe(
        d.users,
        map((user) => user.email),
        unique(),
      ),
  (d) => [...new Set(d.users.map((user) => user.email))],
  lazyShort("unique"),
);

scenario(
  "G1",
  "uniqueBy",
  PIPE_SIZES,
  ({ pipe, uniqueBy }) =>
    (d) =>
      pipe(
        d.users,
        uniqueBy((user) => user.email),
      ),
  (d) => uniqueByEmail(d.users),
  lazyShort("uniqueBy"),
);

scenario(
  "G1",
  "filter+map+take(10)",
  CML,
  ({ pipe, filter, map, take }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.isActive),
        map((user) => user.name),
        take(10),
      ),
  (d) =>
    d.users
      .filter((user) => user.isActive)
      .map((user) => user.name)
      .slice(0, 10),
  lazyShort("take"),
);

scenario(
  "G1",
  "find early hit",
  CML,
  ({ pipe, find }) =>
    (d) => {
      const target = d.earlyId;
      return pipe(
        d.users,
        find((user) => user.id === target),
      );
    },
  (d) => {
    const target = d.earlyId;
    return d.users.find((user) => user.id === target);
  },
  lazyShort("find"),
);

scenario(
  "G1",
  "find late hit",
  CML,
  ({ pipe, find }) =>
    (d) => {
      const target = d.lateId;
      return pipe(
        d.users,
        find((user) => user.id === target),
      );
    },
  (d) => {
    const target = d.lateId;
    return d.users.find((user) => user.id === target);
  },
  lazyShort("find"),
);

scenario(
  "G1",
  "find miss",
  CML,
  ({ pipe, find }) =>
    (d) =>
      pipe(
        d.users,
        find((user) => user.id < 0),
      ),
  (d) => d.users.find((user) => user.id < 0),
  lazyShort("find"),
);

scenario(
  "G1",
  "filter+first",
  PIPE_SIZES,
  ({ pipe, filter, first }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.age > 60),
        first(),
      ),
  (d) => d.users.find((user) => user.age > 60),
  lazyShort("first"),
);

// Only the middle step needs the `data` buffer (the branch's multi-step
// `requiresData` path).
scenario(
  "G1",
  "3-step middle reads data",
  PIPE_SIZES,
  ({ pipe, filter, map }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.isActive),
        map((user, index, data) => data[index].age + index),
        filter((value) => value % 2 === 0),
      ),
  (d) =>
    d.users
      .filter((user) => user.isActive)
      .map((user, index, data) => data[index].age + index)
      .filter((value) => value % 2 === 0),
  lazyShort("filter"),
);

// ===========================================================================
// G1b (pipe, single step and two steps) and G5 (data-first): per utility
// ===========================================================================

// `pipe1`: pipe(data, util(...)); `pipe2`: pipe(data, util(...), map(cheap)),
// except for the single-value utilities (find, first) whose result isn't
// iterable: there the cheap map goes first. `dataFirst`: util(data, ...).
const PER_UTILITY = [
  {
    name: "difference",
    pipe1:
      ({ pipe, difference }) =>
      (d) =>
        pipe(d.users, difference(d.otherUsers)),
    pipe2:
      ({ pipe, difference, map }) =>
      (d) =>
        pipe(
          d.users,
          difference(d.otherUsers),
          map((value) => value),
        ),
    dataFirst:
      ({ difference }) =>
      (d) =>
        difference(d.users, d.otherUsers),
  },
  {
    name: "differenceWith",
    pipe1:
      ({ pipe, differenceWith }) =>
      (d) =>
        pipe(
          d.users,
          differenceWith(d.otherUsers, (a, b) => a.id === b.id),
        ),
    pipe2:
      ({ pipe, differenceWith, map }) =>
      (d) =>
        pipe(
          d.users,
          differenceWith(d.otherUsers, (a, b) => a.id === b.id),
          map((value) => value),
        ),
    dataFirst:
      ({ differenceWith }) =>
      (d) =>
        differenceWith(d.users, d.otherUsers, (a, b) => a.id === b.id),
    native1: (d) =>
      d.users.filter((a) => !d.otherUsers.some((b) => a.id === b.id)),
    native2: (d) =>
      d.users
        .filter((a) => !d.otherUsers.some((b) => a.id === b.id))
        .map((value) => value),
  },
  {
    name: "drop",
    pipe1:
      ({ pipe, drop }) =>
      (d) =>
        pipe(d.users, drop(d.quarter)),
    pipe2:
      ({ pipe, drop, map }) =>
      (d) =>
        pipe(
          d.users,
          drop(d.quarter),
          map((value) => value),
        ),
    dataFirst:
      ({ drop }) =>
      (d) =>
        drop(d.users, d.quarter),
    native1: (d) => d.users.slice(d.quarter),
    native2: (d) => d.users.slice(d.quarter).map((value) => value),
  },
  {
    name: "filter",
    pipe1:
      ({ pipe, filter }) =>
      (d) =>
        pipe(
          d.users,
          filter((user) => user.isActive),
        ),
    pipe2:
      ({ pipe, filter, map }) =>
      (d) =>
        pipe(
          d.users,
          filter((user) => user.isActive),
          map((value) => value),
        ),
    dataFirst:
      ({ filter }) =>
      (d) =>
        filter(d.users, (user) => user.isActive),
    native1: (d) => d.users.filter((user) => user.isActive),
    native2: (d) =>
      d.users.filter((user) => user.isActive).map((value) => value),
  },
  {
    name: "find",
    pipe1:
      ({ pipe, find }) =>
      (d) => {
        const target = d.middleId;
        return pipe(
          d.users,
          find((user) => user.id === target),
        );
      },
    pipe2:
      ({ pipe, find, map }) =>
      (d) => {
        const target = d.middleId;
        return pipe(
          d.users,
          map((value) => value),
          find((user) => user.id === target),
        );
      },
    dataFirst:
      ({ find }) =>
      (d) => {
        const target = d.middleId;
        return find(d.users, (user) => user.id === target);
      },
    native1: (d) => {
      const target = d.middleId;
      return d.users.find((user) => user.id === target);
    },
    native2: (d) => {
      const target = d.middleId;
      return d.users.map((value) => value).find((user) => user.id === target);
    },
  },
  {
    name: "first",
    pipe1:
      ({ pipe, first }) =>
      (d) =>
        pipe(d.users, first()),
    pipe2:
      ({ pipe, first, map }) =>
      (d) =>
        pipe(
          d.users,
          map((value) => value),
          first(),
        ),
    dataFirst:
      ({ first }) =>
      (d) =>
        first(d.users),
    native1: (d) => d.users[0],
    native2: (d) => d.users.map((value) => value)[0],
  },
  {
    name: "flat",
    pipe1:
      ({ pipe, flat }) =>
      (d) =>
        pipe(d.nested, flat()),
    pipe2:
      ({ pipe, flat, map }) =>
      (d) =>
        pipe(
          d.nested,
          flat(),
          map((value) => value),
        ),
    dataFirst:
      ({ flat }) =>
      (d) =>
        flat(d.nested),
    native1: (d) => d.nested.flat(),
    native2: (d) => d.nested.flat().map((value) => value),
  },
  {
    name: "flatMap",
    pipe1:
      ({ pipe, flatMap }) =>
      (d) =>
        pipe(
          d.orders,
          flatMap((order) => order.items),
        ),
    pipe2:
      ({ pipe, flatMap, map }) =>
      (d) =>
        pipe(
          d.orders,
          flatMap((order) => order.items),
          map((value) => value),
        ),
    dataFirst:
      ({ flatMap }) =>
      (d) =>
        flatMap(d.orders, (order) => order.items),
    native1: (d) => d.orders.flatMap((order) => order.items),
    native2: (d) =>
      d.orders.flatMap((order) => order.items).map((value) => value),
  },
  {
    name: "forEach",
    pipe1:
      ({ pipe, forEach }) =>
      (d) =>
        pipe(
          d.users,
          forEach((user) => {
            effects.value = user.id;
          }),
        ),
    pipe2:
      ({ pipe, forEach, map }) =>
      (d) =>
        pipe(
          d.users,
          forEach((user) => {
            effects.value = user.id;
          }),
          map((value) => value),
        ),
    dataFirst:
      ({ forEach }) =>
      (d) =>
        forEach(d.users, (user) => {
          effects.value = user.id;
        }),
    native1: (d) => {
      d.users.forEach((user) => {
        effects.value = user.id;
      });
      return d.users;
    },
    native2: (d) => {
      d.users.forEach((user) => {
        effects.value = user.id;
      });
      return d.users.map((value) => value);
    },
  },
  {
    name: "intersection",
    pipe1:
      ({ pipe, intersection }) =>
      (d) =>
        pipe(d.users, intersection(d.otherUsers)),
    pipe2:
      ({ pipe, intersection, map }) =>
      (d) =>
        pipe(
          d.users,
          intersection(d.otherUsers),
          map((value) => value),
        ),
    dataFirst:
      ({ intersection }) =>
      (d) =>
        intersection(d.users, d.otherUsers),
  },
  {
    name: "intersectionWith",
    pipe1:
      ({ pipe, intersectionWith }) =>
      (d) =>
        pipe(
          d.users,
          intersectionWith(d.otherUsers, (a, b) => a.id === b.id),
        ),
    pipe2:
      ({ pipe, intersectionWith, map }) =>
      (d) =>
        pipe(
          d.users,
          intersectionWith(d.otherUsers, (a, b) => a.id === b.id),
          map((value) => value),
        ),
    dataFirst:
      ({ intersectionWith }) =>
      (d) =>
        intersectionWith(d.users, d.otherUsers, (a, b) => a.id === b.id),
    native1: (d) =>
      d.users.filter((a) => d.otherUsers.some((b) => a.id === b.id)),
    native2: (d) =>
      d.users
        .filter((a) => d.otherUsers.some((b) => a.id === b.id))
        .map((value) => value),
  },
  {
    name: "map",
    pipe1:
      ({ pipe, map }) =>
      (d) =>
        pipe(
          d.users,
          map((user) => user.name),
        ),
    pipe2:
      ({ pipe, map }) =>
      (d) =>
        pipe(
          d.users,
          map((user) => user.name),
          map((value) => value),
        ),
    dataFirst:
      ({ map }) =>
      (d) =>
        map(d.users, (user) => user.name),
    native1: (d) => d.users.map((user) => user.name),
    native2: (d) => d.users.map((user) => user.name).map((value) => value),
  },
  {
    name: "mapWithFeedback",
    pipe1:
      ({ pipe, mapWithFeedback }) =>
      (d) =>
        pipe(
          d.users,
          mapWithFeedback((total, user) => total + user.age, 0),
        ),
    pipe2:
      ({ pipe, mapWithFeedback, map }) =>
      (d) =>
        pipe(
          d.users,
          mapWithFeedback((total, user) => total + user.age, 0),
          map((value) => value),
        ),
    dataFirst:
      ({ mapWithFeedback }) =>
      (d) =>
        mapWithFeedback(d.users, (total, user) => total + user.age, 0),
    native1: (d) => {
      let total = 0;
      return d.users.map((user) => (total += user.age));
    },
    native2: (d) => {
      let total = 0;
      return d.users.map((user) => (total += user.age)).map((value) => value);
    },
  },
  {
    name: "take",
    pipe1:
      ({ pipe, take }) =>
      (d) =>
        pipe(d.users, take(d.half)),
    pipe2:
      ({ pipe, take, map }) =>
      (d) =>
        pipe(
          d.users,
          take(d.half),
          map((value) => value),
        ),
    dataFirst:
      ({ take }) =>
      (d) =>
        take(d.users, d.half),
    native1: (d) => d.users.slice(0, d.half),
    native2: (d) => d.users.slice(0, d.half).map((value) => value),
  },
  {
    name: "unique",
    pipe1:
      ({ pipe, unique }) =>
      (d) =>
        pipe(d.emails, unique()),
    pipe2:
      ({ pipe, unique, map }) =>
      (d) =>
        pipe(
          d.emails,
          unique(),
          map((value) => value),
        ),
    dataFirst:
      ({ unique }) =>
      (d) =>
        unique(d.emails),
    native1: (d) => [...new Set(d.emails)],
    native2: (d) => [...new Set(d.emails)].map((value) => value),
  },
  {
    name: "uniqueBy",
    pipe1:
      ({ pipe, uniqueBy }) =>
      (d) =>
        pipe(
          d.users,
          uniqueBy((user) => user.email),
        ),
    pipe2:
      ({ pipe, uniqueBy, map }) =>
      (d) =>
        pipe(
          d.users,
          uniqueBy((user) => user.email),
          map((value) => value),
        ),
    dataFirst:
      ({ uniqueBy }) =>
      (d) =>
        uniqueBy(d.users, (user) => user.email),
  },
  {
    name: "uniqueWith",
    pipe1:
      ({ pipe, uniqueWith }) =>
      (d) =>
        pipe(
          d.users,
          uniqueWith((a, b) => a.email === b.email),
        ),
    pipe2:
      ({ pipe, uniqueWith, map }) =>
      (d) =>
        pipe(
          d.users,
          uniqueWith((a, b) => a.email === b.email),
          map((value) => value),
        ),
    dataFirst:
      ({ uniqueWith }) =>
      (d) =>
        uniqueWith(d.users, (a, b) => a.email === b.email),
    native1: (d) =>
      d.users.filter(
        (a, index, all) => all.findIndex((b) => a.email === b.email) === index,
      ),
    native2: (d) =>
      d.users
        .filter(
          (a, index, all) =>
            all.findIndex((b) => a.email === b.email) === index,
        )
        .map((value) => value),
  },
  {
    name: "zip",
    pipe1:
      ({ pipe, zip }) =>
      (d) =>
        pipe(d.users, zip(d.partnerNumbers)),
    pipe2:
      ({ pipe, zip, map }) =>
      (d) =>
        pipe(
          d.users,
          zip(d.partnerNumbers),
          map((value) => value),
        ),
    dataFirst:
      ({ zip }) =>
      (d) =>
        zip(d.users, d.partnerNumbers),
    native1: (d) =>
      d.users.map((user, index) => [user, d.partnerNumbers[index]]),
    native2: (d) =>
      d.users
        .map((user, index) => [user, d.partnerNumbers[index]])
        .map((value) => value),
  },
  {
    name: "zipWith",
    pipe1:
      ({ pipe, zipWith }) =>
      (d) =>
        pipe(
          d.numbers,
          zipWith(d.partnerNumbers, (a, b) => a + b),
        ),
    pipe2:
      ({ pipe, zipWith, map }) =>
      (d) =>
        pipe(
          d.numbers,
          zipWith(d.partnerNumbers, (a, b) => a + b),
          map((value) => value),
        ),
    dataFirst:
      ({ zipWith }) =>
      (d) =>
        zipWith(d.numbers, d.partnerNumbers, (a, b) => a + b),
    native1: (d) =>
      d.numbers.map((value, index) => value + d.partnerNumbers[index]),
    native2: (d) =>
      d.numbers
        .map((value, index) => value + d.partnerNumbers[index])
        .map((value) => value),
  },
];

for (const utility of PER_UTILITY) {
  scenario(
    "G1b",
    `pipe ${utility.name}`,
    UP_TO_M,
    utility.pipe1,
    utility.native1,
    lazyShort(utility.name),
  );
  scenario(
    "G1b",
    `pipe ${utility.name}+map`,
    UP_TO_M,
    utility.pipe2,
    utility.native2,
    lazyShort(utility.name),
  );
}

// The data-first regression guard. PER_UTILITY covers every utility whose
// data-first path the branch changes: the 9 `purryWithLazy` ones (an extra hop
// through `purry`), the 8 `purryFromLazy` ones (now `processSingleLazyStep`
// instead of `pipe`), plus `flat` and `zipWith` (own dispatch, expected
// untouched). `first` also runs at Mx64 because one call is a single timer
// tick.
for (const utility of PER_UTILITY) {
  scenario(
    "G5",
    `data-first ${utility.name}`,
    utility.name === "first" ? [...UP_TO_M, "Mx64"] : UP_TO_M,
    utility.dataFirst,
    utility.native1,
    {
      kind: "data-first",
      main: utility.name,
      tags:
        utility.name === "map" || utility.name === "filter"
          ? [...GUARD, ...HEADLINE]
          : GUARD,
    },
  );
}

// Cheap calls, where per-call overhead dominates at any size. Plain M is a
// handful of timer ticks per call; Mx64 batches 64 calls over 64 distinct
// 1000-item arrays.
scenario(
  "G5",
  "data-first take(3)",
  ["M", "Mx64"],
  ({ take }) =>
    (d) =>
      take(d.users, 3),
  (d) => d.users.slice(0, 3),
  { kind: "data-first", main: "take", tags: GUARD },
);

scenario(
  "G5",
  "data-first drop(3)",
  ["M", "Mx64"],
  ({ drop }) =>
    (d) =>
      drop(d.users, 3),
  (d) => d.users.slice(3),
  { kind: "data-first", main: "drop", tags: GUARD },
);

scenario(
  "G5",
  "data-first find early hit",
  ["M", "Mx64"],
  ({ find }) =>
    (d) => {
      const target = d.earlyId;
      return find(d.users, (user) => user.id === target);
    },
  (d) => {
    const target = d.earlyId;
    return d.users.find((user) => user.id === target);
  },
  { kind: "data-first", main: "find", tags: GUARD },
);

// The biggest adopter's whole call shape (`@prisma/dev` allocates ports with
// `difference(range(a, b), used)`, both data-first).
scenario(
  "G5",
  "data-first difference(range) (adopter shape)",
  UP_TO_M,
  ({ difference, range }) =>
    (d) =>
      difference(range(0, d.users.length), d.usedIndices),
  (d) => {
    const used = new Set(d.usedIndices);
    return Array.from({ length: d.users.length }, (_, index) => index).filter(
      (index) => !used.has(index),
    );
  },
  { kind: "data-first", main: "difference", tags: GUARD },
);

// Callbacks that read `data`, so the branch's arity gate turns the buffer on
// for these `purryFromLazy` utilities. (`differenceWith` / `intersectionWith`
// comparators take no `data`; their 2-arity case is the plain entry above.)
scenario(
  "G5",
  "data-first uniqueBy (reads data)",
  UP_TO_M,
  ({ uniqueBy }) =>
    (d) =>
      uniqueBy(d.users, (user, index, data) => data[index].email),
  undefined,
  { kind: "data-first", main: "uniqueBy", tags: GUARD },
);

scenario(
  "G5",
  "data-first mapWithFeedback (reads data)",
  UP_TO_M,
  ({ mapWithFeedback }) =>
    (d) =>
      mapWithFeedback(
        d.users,
        (total, user, index, data) => total + data[index].age,
        0,
      ),
  (d) => {
    let total = 0;
    return d.users.map((user, index, data) => (total += data[index].age));
  },
  { kind: "data-first", main: "mapWithFeedback", tags: GUARD },
);

// ===========================================================================
// G2: deep pipes
// ===========================================================================

scenario(
  "G2",
  "deep-8 primitive",
  SML,
  ({ pipe, map, filter }) =>
    (d) =>
      pipe(
        d.numbers,
        map((n) => n + 3),
        filter((n) => n % 17 !== 0),
        map((n) => n * 2),
        filter((n) => n % 19 !== 0),
        map((n) => n - 1),
        filter((n) => n % 23 !== 0),
        map((n) => n + 5),
        filter((n) => n % 29 !== 0),
      ),
  (d) =>
    d.numbers
      .map((n) => n + 3)
      .filter((n) => n % 17 !== 0)
      .map((n) => n * 2)
      .filter((n) => n % 19 !== 0)
      .map((n) => n - 1)
      .filter((n) => n % 23 !== 0)
      .map((n) => n + 5)
      .filter((n) => n % 29 !== 0),
  { kind: "lazy-long", main: "pipe" },
);

scenario(
  "G2",
  "deep-15 primitive",
  ["M"],
  ({ pipe, map, filter }) =>
    (d) =>
      pipe(
        d.numbers,
        map((n) => n + 3),
        filter((n) => n % 17 !== 0),
        map((n) => n * 2),
        filter((n) => n % 19 !== 0),
        map((n) => n - 1),
        filter((n) => n % 23 !== 0),
        map((n) => n + 5),
        filter((n) => n % 29 !== 0),
        map((n) => n * 3),
        filter((n) => n % 31 !== 0),
        map((n) => n + 7),
        filter((n) => n % 37 !== 0),
        map((n) => n - 2),
        filter((n) => n % 41 !== 0),
        map((n) => n + 1),
      ),
  (d) =>
    d.numbers
      .map((n) => n + 3)
      .filter((n) => n % 17 !== 0)
      .map((n) => n * 2)
      .filter((n) => n % 19 !== 0)
      .map((n) => n - 1)
      .filter((n) => n % 23 !== 0)
      .map((n) => n + 5)
      .filter((n) => n % 29 !== 0)
      .map((n) => n * 3)
      .filter((n) => n % 31 !== 0)
      .map((n) => n + 7)
      .filter((n) => n % 37 !== 0)
      .map((n) => n - 2)
      .filter((n) => n % 41 !== 0)
      .map((n) => n + 1),
  { kind: "lazy-long", main: "pipe" },
);

// Every step yields an existing object: filters keep ~90%, maps hop
// user -> profile -> user.
scenario(
  "G2",
  "deep-8 object",
  SML,
  ({ pipe, map, filter }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.id % 10 !== 1),
        map((user) => user.profile),
        filter((profile) => profile.score % 10 !== 2),
        map((profile) => profile.user),
        filter((user) => user.age % 10 !== 3),
        map((user) => user.profile),
        filter((profile) => profile.score % 10 !== 4),
        map((profile) => profile.user),
      ),
  (d) =>
    d.users
      .filter((user) => user.id % 10 !== 1)
      .map((user) => user.profile)
      .filter((profile) => profile.score % 10 !== 2)
      .map((profile) => profile.user)
      .filter((user) => user.age % 10 !== 3)
      .map((user) => user.profile)
      .filter((profile) => profile.score % 10 !== 4)
      .map((profile) => profile.user),
  { kind: "lazy-long", main: "pipe" },
);

scenario(
  "G2",
  "deep-15 object",
  ["M"],
  ({ pipe, map, filter }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.id % 10 !== 1),
        map((user) => user.profile),
        filter((profile) => profile.score % 10 !== 2),
        map((profile) => profile.user),
        filter((user) => user.age % 10 !== 3),
        map((user) => user.profile),
        filter((profile) => profile.score % 10 !== 4),
        map((profile) => profile.user),
        filter((user) => user.id % 10 !== 5),
        map((user) => user.profile),
        filter((profile) => profile.score % 10 !== 6),
        map((profile) => profile.user),
        filter((user) => user.age % 10 !== 7),
        map((user) => user.profile),
        map((profile) => profile.user),
      ),
  (d) =>
    d.users
      .filter((user) => user.id % 10 !== 1)
      .map((user) => user.profile)
      .filter((profile) => profile.score % 10 !== 2)
      .map((profile) => profile.user)
      .filter((user) => user.age % 10 !== 3)
      .map((user) => user.profile)
      .filter((profile) => profile.score % 10 !== 4)
      .map((profile) => profile.user)
      .filter((user) => user.id % 10 !== 5)
      .map((user) => user.profile)
      .filter((profile) => profile.score % 10 !== 6)
      .map((profile) => profile.user)
      .filter((user) => user.age % 10 !== 7)
      .map((user) => user.profile)
      .map((profile) => profile.user),
  { kind: "lazy-long", main: "pipe" },
);

scenario(
  "G2",
  "deep-8 flatMap-first",
  SML,
  ({ pipe, flatMap, map, filter }) =>
    (d) =>
      pipe(
        d.orders,
        flatMap((order) => order.items),
        filter((item) => item.price % 10 !== 0),
        map((item) => item.price * item.quantity),
        filter((n) => n % 7 !== 0),
        map((n) => n + 1),
        filter((n) => n % 11 !== 0),
        map((n) => n * 2),
        filter((n) => n % 13 !== 0),
      ),
  (d) =>
    d.orders
      .flatMap((order) => order.items)
      .filter((item) => item.price % 10 !== 0)
      .map((item) => item.price * item.quantity)
      .filter((n) => n % 7 !== 0)
      .map((n) => n + 1)
      .filter((n) => n % 11 !== 0)
      .map((n) => n * 2)
      .filter((n) => n % 13 !== 0),
  { kind: "lazy-long", main: "pipe" },
);

scenario(
  "G2",
  "deep-15 flatMap-first",
  ["M"],
  ({ pipe, flatMap, map, filter }) =>
    (d) =>
      pipe(
        d.orders,
        flatMap((order) => order.items),
        filter((item) => item.price % 10 !== 0),
        map((item) => item.price * item.quantity),
        filter((n) => n % 7 !== 0),
        map((n) => n + 1),
        filter((n) => n % 11 !== 0),
        map((n) => n * 2),
        filter((n) => n % 13 !== 0),
        map((n) => n - 3),
        filter((n) => n % 17 !== 0),
        map((n) => n + 4),
        filter((n) => n % 19 !== 0),
        map((n) => n * 3),
        filter((n) => n % 23 !== 0),
        map((n) => n + 2),
      ),
  (d) =>
    d.orders
      .flatMap((order) => order.items)
      .filter((item) => item.price % 10 !== 0)
      .map((item) => item.price * item.quantity)
      .filter((n) => n % 7 !== 0)
      .map((n) => n + 1)
      .filter((n) => n % 11 !== 0)
      .map((n) => n * 2)
      .filter((n) => n % 13 !== 0)
      .map((n) => n - 3)
      .filter((n) => n % 17 !== 0)
      .map((n) => n + 4)
      .filter((n) => n % 19 !== 0)
      .map((n) => n * 3)
      .filter((n) => n % 23 !== 0)
      .map((n) => n + 2),
  { kind: "lazy-long", main: "pipe" },
);

// 3 lazy, a non-lazy `sortBy`, 3 lazy, then a plain function.
scenario(
  "G2",
  "deep-8 mixed",
  SML,
  ({ pipe, map, filter, sortBy }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.isActive),
        map((user) => user.profile),
        map((profile) => profile.user),
        sortBy((user) => user.age),
        filter((user) => user.id % 10 !== 1),
        map((user) => user.profile),
        map((profile) => profile.user),
        (users) => users.slice(0, 10),
      ),
  (d) =>
    d.users
      .filter((user) => user.isActive)
      .map((user) => user.profile)
      .map((profile) => profile.user)
      .toSorted((a, b) => a.age - b.age)
      .filter((user) => user.id % 10 !== 1)
      .map((user) => user.profile)
      .map((profile) => profile.user)
      .slice(0, 10),
  { kind: "interleaved", main: "pipe" },
);

// 7 lazy, `sortBy`, 6 lazy, then a plain function.
scenario(
  "G2",
  "deep-15 mixed",
  ["M"],
  ({ pipe, map, filter, sortBy }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.isActive),
        map((user) => user.profile),
        map((profile) => profile.user),
        filter((user) => user.id % 10 !== 1),
        map((user) => user.profile),
        map((profile) => profile.user),
        filter((user) => user.age % 10 !== 3),
        sortBy((user) => user.age),
        map((user) => user.profile),
        map((profile) => profile.user),
        filter((user) => user.id % 10 !== 5),
        map((user) => user.profile),
        map((profile) => profile.user),
        filter((user) => user.age % 10 !== 7),
        (users) => users.slice(0, 10),
      ),
  (d) =>
    d.users
      .filter((user) => user.isActive)
      .map((user) => user.profile)
      .map((profile) => profile.user)
      .filter((user) => user.id % 10 !== 1)
      .map((user) => user.profile)
      .map((profile) => profile.user)
      .filter((user) => user.age % 10 !== 3)
      .toSorted((a, b) => a.age - b.age)
      .map((user) => user.profile)
      .map((profile) => profile.user)
      .filter((user) => user.id % 10 !== 5)
      .map((user) => user.profile)
      .map((profile) => profile.user)
      .filter((user) => user.age % 10 !== 7)
      .slice(0, 10),
  { kind: "lazy-other", main: "pipe" },
);

// ===========================================================================
// G3: non-lazy pipes (x64 = batched over 64 inputs, x1 = a single input)
// ===========================================================================

scenario(
  "G3",
  "pipe(x)",
  SCALAR,
  ({ pipe }) =>
    (d) =>
      pipe(d.scalar),
  (d) => d.scalar,
  { kind: "non-lazy-pipe", main: "pipe" },
);

scenario(
  "G3",
  "pipe(x, add(1))",
  SCALAR,
  ({ pipe, add }) =>
    (d) =>
      pipe(d.scalar, add(1)),
  (d) => d.scalar + 1,
  { kind: "non-lazy-pipe", main: "pipe", tags: HEADLINE },
);

scenario(
  "G3",
  "pipe(x, arrow)",
  SCALAR,
  ({ pipe }) =>
    (d) =>
      pipe(d.scalar, (n) => n + 1),
  (d) => d.scalar + 1,
  { kind: "non-lazy-pipe", main: "pipe" },
);

scenario(
  "G3",
  "scalar purry depth-3",
  SCALAR,
  ({ pipe, add, multiply, clamp }) =>
    (d) =>
      pipe(d.scalar, add(1), multiply(2), clamp({ min: 0, max: 1000 })),
  (d) => Math.min(Math.max((d.scalar + 1) * 2, 0), 1000),
  { kind: "non-lazy-pipe", main: "pipe" },
);

scenario(
  "G3",
  "scalar purry depth-10",
  SCALAR,
  ({ pipe, add, multiply, subtract, clamp }) =>
    (d) =>
      pipe(
        d.scalar,
        add(1),
        multiply(2),
        subtract(3),
        clamp({ min: 0, max: 1000 }),
        add(5),
        multiply(3),
        subtract(7),
        clamp({ min: 10, max: 5000 }),
        add(2),
        multiply(4),
      ),
  (d) =>
    (Math.min(
      Math.max(
        (Math.min(Math.max((d.scalar + 1) * 2 - 3, 0), 1000) + 5) * 3 - 7,
        10,
      ),
      5000,
    ) +
      2) *
    4,
  { kind: "non-lazy-pipe", main: "pipe" },
);

scenario(
  "G3",
  "scalar arrows depth-3",
  SCALAR,
  ({ pipe }) =>
    (d) =>
      pipe(
        d.scalar,
        (n) => n + 1,
        (n) => n * 2,
        (n) => Math.min(Math.max(n, 0), 1000),
      ),
  (d) => Math.min(Math.max((d.scalar + 1) * 2, 0), 1000),
  { kind: "non-lazy-pipe", main: "pipe", tags: HEADLINE },
);

scenario(
  "G3",
  "scalar arrows depth-10",
  SCALAR,
  ({ pipe }) =>
    (d) =>
      pipe(
        d.scalar,
        (n) => n + 1,
        (n) => n * 2,
        (n) => n - 3,
        (n) => Math.min(Math.max(n, 0), 1000),
        (n) => n + 5,
        (n) => n * 3,
        (n) => n - 7,
        (n) => Math.min(Math.max(n, 10), 5000),
        (n) => n + 2,
        (n) => n * 4,
      ),
  (d) =>
    (Math.min(
      Math.max(
        (Math.min(Math.max((d.scalar + 1) * 2 - 3, 0), 1000) + 5) * 3 - 7,
        10,
      ),
      5000,
    ) +
      2) *
    4,
  { kind: "non-lazy-pipe", main: "pipe" },
);

scenario(
  "G3",
  "object pick+omit+set+merge",
  SCALAR,
  ({ pipe, pick, omit, set, merge }) =>
    (d) =>
      pipe(
        d.user,
        pick(["id", "name", "age", "role"]),
        omit(["role"]),
        set("age", 0),
        merge({ isNew: true }),
      ),
  (d) => {
    const { id, name } = d.user;
    return { id, name, age: 0, isNew: true };
  },
  { kind: "non-lazy-pipe", main: "pipe" },
);

scenario(
  "G3",
  "array sortBy+groupBy",
  UP_TO_M,
  ({ pipe, sortBy, groupBy }) =>
    (d) =>
      pipe(
        d.users,
        sortBy((user) => user.age),
        groupBy((user) => user.role),
      ),
  (d) => groupByRole(d.users.toSorted((a, b) => a.age - b.age)),
  { kind: "non-lazy-pipe", main: "pipe" },
);

// ===========================================================================
// G4: other iterables in pipe
// ===========================================================================

scenario(
  "G4",
  "Set map+filter",
  SM,
  ({ pipe, map, filter }) =>
    (d) =>
      pipe(
        d.idSet,
        map((n) => n * 2),
        filter((n) => n % 3 !== 0),
      ),
  (d) =>
    d.idSet
      .values()
      .map((n) => n * 2)
      .filter((n) => n % 3 !== 0)
      .toArray(),
  { kind: "iterable", main: "pipe" },
);

scenario(
  "G4",
  "Set unique",
  SM,
  ({ pipe, unique }) =>
    (d) =>
      pipe(d.idSet, unique()),
  (d) => [...new Set(d.idSet)],
  { kind: "iterable", main: "pipe" },
);

scenario(
  "G4",
  "string map+filter",
  SM,
  ({ pipe, map, filter }) =>
    (d) =>
      pipe(
        d.text,
        map((character) => character.toUpperCase()),
        filter((character) => character !== "E"),
      ),
  (d) =>
    d.text[Symbol.iterator]()
      .map((character) => character.toUpperCase())
      .filter((character) => character !== "E")
      .toArray(),
  { kind: "iterable", main: "pipe" },
);

scenario(
  "G4",
  "string unique",
  SM,
  ({ pipe, unique }) =>
    (d) =>
      pipe(d.text, unique()),
  (d) => [...new Set(d.text)],
  { kind: "iterable", main: "pipe" },
);

// The generator is created inside the measured call: a generator is consumed
// by the pipe that reads it.
scenario(
  "G4",
  "generator map+filter",
  SM,
  ({ pipe, map, filter }) =>
    (d) =>
      pipe(
        iterate(d.numbers),
        map((n) => n * 2),
        filter((n) => n % 3 !== 0),
      ),
  (d) =>
    iterate(d.numbers)
      .map((n) => n * 2)
      .filter((n) => n % 3 !== 0)
      .toArray(),
  { kind: "iterable", main: "pipe" },
);

scenario(
  "G4",
  "generator unique",
  SM,
  ({ pipe, unique }) =>
    (d) =>
      pipe(iterate(d.numbers), unique()),
  (d) => [...new Set(iterate(d.numbers))],
  { kind: "iterable", main: "pipe" },
);

// ===========================================================================
// G6: data-last outside pipe
// ===========================================================================

scenario(
  "G6",
  "map(fn)(data)",
  UP_TO_M,
  ({ map }) =>
    (d) =>
      map((user) => user.name)(d.users),
  (d) => d.users.map((user) => user.name),
  { kind: "data-last", main: "map", tags: HEADLINE },
);

scenario(
  "G6",
  "filter(fn)(data)",
  UP_TO_M,
  ({ filter }) =>
    (d) =>
      filter((user) => user.isActive)(d.users),
  (d) => d.users.filter((user) => user.isActive),
  { kind: "data-last", main: "filter" },
);

scenario(
  "G6",
  "unique()(data)",
  UP_TO_M,
  ({ unique }) =>
    (d) =>
      unique()(d.emails),
  (d) => [...new Set(d.emails)],
  { kind: "data-last", main: "unique" },
);

scenario(
  "G6",
  "piped(filter, map)(data)",
  UP_TO_M,
  ({ piped, filter, map }) =>
    (d) =>
      piped(
        filter((user) => user.isActive),
        map((user) => user.name),
      )(d.users),
  (d) => d.users.filter((user) => user.isActive).map((user) => user.name),
  { kind: "reuse", main: "piped" },
);

// ===========================================================================
// G7: utilities called directly, data-first and data-last, outside any pipe.
// The twelve most used plain-`purry` utilities (research/popularity.json
// `g7Pick`) plus `range` (half of the biggest adopter's surface) run at XS / S
// / C, where an object's size is its key count (`d.record`); the earlier G7
// utilities outside that list stay at S only. On the branch `purry` lost its
// `lazy` parameter and its argument-count checks.
// ===========================================================================

function chunkNative(list, size) {
  return Array.from({ length: Math.ceil(list.length / size) }, (_, index) =>
    list.slice(index * size, index * size + size),
  );
}

function sameFlatRecord(left, right) {
  const leftKeys = Object.keys(left);
  return (
    leftKeys.length === Object.keys(right).length &&
    leftKeys.every((key) => Object.is(left[key], right[key]))
  );
}

const DIRECT = [
  {
    name: "omit",
    dataFirst:
      ({ omit }) =>
      (d) =>
        omit(d.record, d.recordKeys),
    dataLast:
      ({ omit }) =>
      (d) =>
        omit(d.recordKeys)(d.record),
    native: (d) =>
      Object.fromEntries(
        Object.entries(d.record).filter(([key]) => !d.recordKeys.includes(key)),
      ),
  },
  {
    name: "entries",
    dataFirst:
      ({ entries }) =>
      (d) =>
        entries(d.record),
    dataLast:
      ({ entries }) =>
      (d) =>
        entries()(d.record),
    native: (d) => Object.entries(d.record),
  },
  {
    name: "mapValues",
    dataFirst:
      ({ mapValues }) =>
      (d) =>
        mapValues(d.record, (value) => value * 2),
    dataLast:
      ({ mapValues }) =>
      (d) =>
        mapValues((value) => value * 2)(d.record),
    native: (d) =>
      Object.fromEntries(
        Object.entries(d.record).map(([key, value]) => [key, value * 2]),
      ),
  },
  {
    name: "isDeepEqual",
    dataFirst:
      ({ isDeepEqual }) =>
      (d) =>
        isDeepEqual(d.record, d.recordCopy),
    dataLast:
      ({ isDeepEqual }) =>
      (d) =>
        isDeepEqual(d.recordCopy)(d.record),
    native: (d) => sameFlatRecord(d.record, d.recordCopy),
  },
  {
    name: "groupBy",
    dataFirst:
      ({ groupBy }) =>
      (d) =>
        groupBy(d.users, (user) => user.role),
    dataLast:
      ({ groupBy }) =>
      (d) =>
        groupBy((user) => user.role)(d.users),
    native: (d) => groupByRole(d.users),
  },
  {
    name: "pick",
    dataFirst:
      ({ pick }) =>
      (d) =>
        pick(d.record, d.recordKeys),
    dataLast:
      ({ pick }) =>
      (d) =>
        pick(d.recordKeys)(d.record),
    native: (d) =>
      Object.fromEntries(
        d.recordKeys
          .filter((key) => key in d.record)
          .map((key) => [key, d.record[key]]),
      ),
  },
  {
    name: "clone",
    dataFirst:
      ({ clone }) =>
      (d) =>
        clone(d.record),
    dataLast:
      ({ clone }) =>
      (d) =>
        clone()(d.record),
    // The record's values are numbers, so a shallow copy is a deep one.
    native: (d) => ({ ...d.record }),
  },
  {
    name: "clamp",
    dataFirst:
      ({ clamp }) =>
      (d) =>
        clamp(d.scalar, { min: 20, max: 500 }),
    dataLast:
      ({ clamp }) =>
      (d) =>
        clamp({ min: 20, max: 500 })(d.scalar),
    native: (d) => Math.min(Math.max(d.scalar, 20), 500),
  },
  {
    name: "chunk",
    dataFirst:
      ({ chunk }) =>
      (d) =>
        chunk(d.users, 4),
    dataLast:
      ({ chunk }) =>
      (d) =>
        chunk(4)(d.users),
    native: (d) => chunkNative(d.users, 4),
  },
  {
    name: "mergeDeep",
    dataFirst:
      ({ mergeDeep }) =>
      (d) =>
        mergeDeep(d.record, d.recordPatch),
    dataLast:
      ({ mergeDeep }) =>
      (d) =>
        mergeDeep(d.recordPatch)(d.record),
    native: (d) => ({ ...d.record, ...d.recordPatch }),
  },
  {
    name: "keys",
    dataFirst:
      ({ keys }) =>
      (d) =>
        keys(d.record),
    dataLast:
      ({ keys }) =>
      (d) =>
        keys()(d.record),
    native: (d) => Object.keys(d.record),
  },
  {
    name: "mapToObj",
    dataFirst:
      ({ mapToObj }) =>
      (d) =>
        mapToObj(d.users, (user) => [user.email, user.id]),
    dataLast:
      ({ mapToObj }) =>
      (d) =>
        mapToObj((user) => [user.email, user.id])(d.users),
    native: (d) =>
      Object.fromEntries(d.users.map((user) => [user.email, user.id])),
  },
  {
    name: "range",
    dataFirst:
      ({ range }) =>
      (d) =>
        range(0, d.users.length),
    dataLast:
      ({ range }) =>
      (d) =>
        range(d.users.length)(0),
    native: (d) => Array.from({ length: d.users.length }, (_, index) => index),
  },
];

// The earlier G7 utilities outside the popularity pick: cheap, S only, each
// tiered by its own popularity.
const DIRECT_LEGACY = [
  {
    name: "add",
    dataFirst:
      ({ add }) =>
      (d) =>
        add(d.scalar, 2),
    dataLast:
      ({ add }) =>
      (d) =>
        add(2)(d.scalar),
    native: (d) => d.scalar + 2,
  },
  {
    name: "sortBy",
    dataFirst:
      ({ sortBy }) =>
      (d) =>
        sortBy(d.users, (user) => user.age),
    dataLast:
      ({ sortBy }) =>
      (d) =>
        sortBy((user) => user.age)(d.users),
    native: (d) => d.users.toSorted((a, b) => a.age - b.age),
  },
  {
    name: "sumBy",
    dataFirst:
      ({ sumBy }) =>
      (d) =>
        sumBy(d.users, (user) => user.age),
    dataLast:
      ({ sumBy }) =>
      (d) =>
        sumBy((user) => user.age)(d.users),
    native: (d) => d.users.reduce((total, user) => total + user.age, 0),
  },
  {
    name: "set",
    dataFirst:
      ({ set }) =>
      (d) =>
        set(d.user, "age", 0),
    dataLast:
      ({ set }) =>
      (d) =>
        set("age", 0)(d.user),
    native: (d) => ({ ...d.user, age: 0 }),
  },
  {
    name: "merge",
    dataFirst:
      ({ merge }) =>
      (d) =>
        merge(d.user, { isNew: true }),
    dataLast:
      ({ merge }) =>
      (d) =>
        merge({ isNew: true })(d.user),
    native: (d) => ({ ...d.user, isNew: true }),
  },
  {
    name: "toLowerCase",
    dataFirst:
      ({ toLowerCase }) =>
      (d) =>
        toLowerCase(d.user.name),
    dataLast:
      ({ toLowerCase }) =>
      (d) =>
        toLowerCase()(d.user.name),
    native: (d) => d.user.name.toLowerCase(),
  },
];

for (const [list, sizes] of [
  [DIRECT, ["XS", "S", "C"]],
  [DIRECT_LEGACY, ["S"]],
]) {
  for (const utility of list) {
    scenario(
      "G7",
      `${utility.name} data-first`,
      sizes,
      utility.dataFirst,
      utility.native,
      { kind: "data-first", main: utility.name, tags: GUARD },
    );
    scenario(
      "G7",
      `${utility.name} data-last`,
      sizes,
      utility.dataLast,
      utility.native,
      { kind: "data-last", main: utility.name, tags: GUARD },
    );
  }
}

// ===========================================================================
// G6 (continued): steps built once and reused across calls. Both are built
// when the copy's closure is created (once per copy), like module-level
// constants in an application.
// ===========================================================================

scenario(
  "G6",
  "module-level piped reused",
  UP_TO_M,
  ({ piped, filter, map }) => {
    const activeNames = piped(
      filter((user) => user.isActive),
      map((user) => user.name),
    );
    return (d) => activeNames(d.users);
  },
  (d) => d.users.filter((user) => user.isActive).map((user) => user.name),
  { kind: "reuse", main: "piped" },
);

scenario(
  "G6",
  "pipe with reused steps",
  UP_TO_M,
  ({ pipe, filter, map }) => {
    const onlyActive = filter((user) => user.isActive);
    const toName = map((user) => user.name);
    return (d) => pipe(d.users, onlyActive, toName);
  },
  (d) => d.users.filter((user) => user.isActive).map((user) => user.name),
  { kind: "reuse", main: "pipe" },
);

// ===========================================================================
// G8: exotic item kinds (C and M). Every step of the object pipes yields the
// item itself, so the branch's control-object check (`key in result`) meets
// each kind at every step.
// ===========================================================================

const itemKind = (tags) => ({ kind: "item-kind", main: "pipe", tags });

scenario(
  "G8",
  "tuples entries+filter+map+fromEntries",
  CM,
  ({ pipe, entries, filter, map, fromEntries }) =>
    (d) =>
      pipe(
        d.record,
        entries(),
        filter(([, value]) => value % 2 === 0),
        map(([key, value]) => [key, value * 2]),
        fromEntries(),
      ),
  (d) =>
    Object.fromEntries(
      Object.entries(d.record)
        .filter(([, value]) => value % 2 === 0)
        .map(([key, value]) => [key, value * 2]),
    ),
  itemKind(),
);

for (const [field, label] of [
  ["instances", "3-level class instances"],
  ["wide", "40-key objects"],
  ["dictionary", "dictionary-mode objects"],
  ["frozen", "frozen objects"],
  ["proxies", "pass-through Proxy items"],
]) {
  scenario(
    "G8",
    label,
    CM,
    ({ pipe, filter, map }) =>
      (d) =>
        pipe(
          d[field],
          filter((item) => item.isActive),
          map((item) => item),
          filter((item) => item.age > 20),
        ),
    (d) =>
      d[field]
        .filter((item) => item.isActive)
        .map((item) => item)
        .filter((item) => item.age > 20),
    itemKind(field === "proxies" ? TRAPS : undefined),
  );
}

scenario(
  "G8",
  "fresh ({...u}) literals",
  CM,
  ({ pipe, filter, map }) =>
    (d) =>
      pipe(
        d.users,
        map((user) => ({ ...user })),
        filter((user) => user.isActive),
        map((user) => user),
      ),
  (d) =>
    d.users
      .map((user) => ({ ...user }))
      .filter((user) => user.isActive)
      .map((user) => user),
  itemKind(),
);

// ===========================================================================
// G9: callbacks whose `length` is 0, so the branch always collects `data`
// for them.
// ===========================================================================

const lengthZero = (main) => ({ kind: "length0", main });

scenario(
  "G9",
  "map(when(isNullish, constant(0)))",
  UP_TO_M,
  ({ pipe, map, when, isNullish, constant }) =>
    (d) =>
      pipe(d.maybeNumbers, map(when(isNullish, constant(0)))),
  (d) => d.maybeNumbers.map((value) => value ?? 0),
  lengthZero("map"),
);

scenario(
  "G9",
  "forEach(constant(undefined))",
  UP_TO_M,
  ({ pipe, forEach, constant }) =>
    (d) =>
      pipe(d.users, forEach(constant(undefined))),
  (d) => {
    d.users.forEach(() => undefined);
    return d.users;
  },
  lengthZero("forEach"),
);

scenario(
  "G9",
  "map((...args) => args[0])",
  UP_TO_M,
  ({ pipe, map }) =>
    (d) =>
      pipe(
        d.users,
        map((...args) => args[0]),
      ),
  (d) => d.users.map((...args) => args[0]),
  lengthZero("map"),
);

// The multi-step path: only the first step collects `data`.
scenario(
  "G9",
  "map((...args) => args[0])+filter",
  UP_TO_M,
  ({ pipe, map, filter }) =>
    (d) =>
      pipe(
        d.users,
        map((...args) => args[0]),
        filter((user) => user.isActive),
      ),
  (d) => d.users.map((...args) => args[0]).filter((user) => user.isActive),
  lengthZero("map"),
);

// ===========================================================================
// G10: interleaved pipes. Runs of 1-3 lazy steps separated by non-lazy steps,
// so every pipe call sets up several lazy segments (sequence extraction,
// accumulator, iterable check per segment).
// ===========================================================================

const interleaved = (tags) => ({ kind: "interleaved", main: "pipe", tags });

scenario(
  "G10",
  "filter,map / sortBy / take / groupBy",
  UP_TO_M,
  ({ pipe, filter, map, sortBy, take, groupBy }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.isActive),
        map((user) => user.profile),
        sortBy((profile) => profile.score),
        take(5),
        groupBy((profile) => profile.user.role),
      ),
  (d) => {
    const grouped = {};
    for (const profile of d.users
      .filter((user) => user.isActive)
      .map((user) => user.profile)
      .toSorted((a, b) => a.score - b.score)
      .slice(0, 5)) {
      (grouped[profile.user.role] ??= []).push(profile);
    }
    return grouped;
  },
  interleaved(HEADLINE),
);

scenario(
  "G10",
  "prop / filter,map,take / reverse / map / length",
  UP_TO_M,
  ({ pipe, prop, filter, map, take, reverse, length }) =>
    (d) =>
      pipe(
        d,
        prop("users"),
        filter((user) => user.age >= 18),
        map((user) => user.age),
        take(20),
        reverse(),
        map((age) => age * 2),
        length(),
      ),
  (d) =>
    d.users
      .filter((user) => user.age >= 18)
      .map((user) => user.age)
      .slice(0, 20)
      .toReversed()
      .map((age) => age * 2).length,
  interleaved(),
);

// Object-heavy: picked objects, grouped, then back through entries.
scenario(
  "G10",
  "filter,map(pick) / groupBy / entries / map / fromEntries",
  UP_TO_M,
  ({ pipe, filter, map, pick, groupBy, entries, fromEntries }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.isActive),
        map(pick(["id", "name", "role", "age"])),
        groupBy((user) => user.role),
        entries(),
        map(([role, members]) => [role, members.length]),
        fromEntries(),
      ),
  (d) => {
    const grouped = {};
    for (const user of d.users.filter((candidate) => candidate.isActive)) {
      const { id, name, role, age } = user;
      (grouped[role] ??= []).push({ id, name, role, age });
    }
    return Object.fromEntries(
      Object.entries(grouped).map(([role, members]) => [role, members.length]),
    );
  },
  interleaved(),
);

scenario(
  "G10",
  "map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map",
  UP_TO_M,
  ({ pipe, map, filter, sortBy, uniqueBy, take, flatMap }) =>
    (d) =>
      pipe(
        d.users,
        map((user) => user.profile),
        filter((profile) => profile.score > 10),
        sortBy((profile) => profile.score),
        uniqueBy((profile) => profile.user.email),
        take(30),
        (profiles) => profiles.slice(1),
        flatMap((profile) => profile.user.tags),
        filter((tag) => tag !== "red"),
        map((tag) => tag.toUpperCase()),
      ),
  (d) =>
    uniqueByEmail(
      d.users
        .map((user) => user.profile)
        .filter((profile) => profile.score > 10)
        .toSorted((a, b) => a.score - b.score)
        .map((profile) => profile.user),
    )
      .slice(0, 30)
      .map((user) => user.profile)
      .slice(1)
      .flatMap((profile) => profile.user.tags)
      .filter((tag) => tag !== "red")
      .map((tag) => tag.toUpperCase()),
  interleaved(),
);

scenario(
  "G10",
  "filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow",
  UP_TO_M,
  ({ pipe, filter, sortBy, map, groupBy, prop, reverse, take }) =>
    (d) =>
      pipe(
        d.users,
        filter((user) => user.age >= 18),
        sortBy((user) => user.id % 7),
        map((user) => user),
        filter((user) => user.id % 3 !== 0),
        groupBy((user) => user.role),
        (groups) => groups.editor ?? [],
        map(prop("name")),
        reverse(),
        take(10),
        map((name) => name.length),
        (lengths) => lengths.length,
      ),
  (d) => {
    const editors = d.users
      .filter((user) => user.age >= 18)
      .toSorted((a, b) => (a.id % 7) - (b.id % 7))
      .filter((user) => user.id % 3 !== 0)
      .filter((user) => user.role === "editor");
    return editors
      .map((user) => user.name)
      .toReversed()
      .slice(0, 10)
      .map((name) => name.length).length;
  },
  interleaved(),
);
