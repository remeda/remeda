import { bench, describe } from "vitest";
import { filter } from "./filter";
import { find } from "./find";
import { first } from "./first";
import { flatMap } from "./flatMap";
import { forEach } from "./forEach";
import { groupBy } from "./groupBy";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { sortBy } from "./sortBy";
import { take } from "./take";
import { unique } from "./unique";
import { uniqueBy } from "./uniqueBy";

type Role = "admin" | "editor" | "viewer";

type User = {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly isActive: boolean;
  readonly role: Role;
  readonly tags: readonly string[];
};

type OrderItem = {
  readonly sku: string;
  readonly quantity: number;
  readonly price: number;
};

type Order = {
  readonly id: number;
  readonly items: readonly OrderItem[];
};

const ROLES = ["admin", "editor", "viewer"] as const;

const TAG_POOL = ["red", "green", "blue", "yellow", "purple"] as const;

const USER_COUNT = 1000;

const users: readonly User[] = Array.from(
  { length: USER_COUNT },
  (_, index) => {
    const tagCount = 1 + (index % 3);
    const tags = Array.from(
      { length: tagCount },
      (_tag, tagIndex) => TAG_POOL[(index + tagIndex) % TAG_POOL.length]!,
    );
    return {
      id: index,
      name: `User ${index}`,
      // Emails repeat every 700 ids so the dataset has real duplicates for
      // `unique`/`uniqueBy` to remove.
      email: `user${index % 700}@example.com`,
      age: 16 + (index % 65),
      isActive: index % 5 < 3,
      role: ROLES[index % ROLES.length]!,
      tags,
    };
  },
);

const ORDER_COUNT = 1000;

const orders: readonly Order[] = Array.from(
  { length: ORDER_COUNT },
  (_, index) => {
    const itemCount = 1 + (index % 4);
    const items = Array.from({ length: itemCount }, (_item, itemIndex) => {
      const seed = index + itemIndex;
      return {
        sku: `SKU-${seed % 50}`,
        quantity: 1 + (seed % 5),
        price: 10 + (seed % 90),
      };
    });
    return { id: index, items };
  },
);

// Every bench body only performs the measured call and assigns the result
// here, so V8 can't dead-code-eliminate the work. Using an object (instead of
// a bare variable) means the property write escapes and TypeScript doesn't
// flag it as an unused local under `noUnusedLocals`.
const sink: { value: unknown } = { value: undefined };

describe("fused: filter + map", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(
      users,
      filter((user) => user.isActive),
      map((user) => user.name),
    );
  });

  bench("native chain", () => {
    sink.value = users.filter((user) => user.isActive).map((user) => user.name);
  });
});

describe("fused: map + filter + map", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(
      users,
      map(prop("age")),
      filter((age) => age >= 18),
      map((age) => age * 12),
    );
  });

  bench("native chain", () => {
    sink.value = users
      .map((user) => user.age)
      .filter((age) => age >= 18)
      .map((age) => age * 12);
  });
});

describe("fused: flatMap + filter + map", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(
      orders,
      flatMap((order) => order.items),
      filter((item) => item.quantity > 1),
      map((item) => item.price * item.quantity),
    );
  });

  bench("native chain", () => {
    sink.value = orders
      .flatMap((order) => order.items)
      .filter((item) => item.quantity > 1)
      .map((item) => item.price * item.quantity);
  });
});

describe("fused: map + unique", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(users, map(prop("email")), unique());
  });

  bench("native chain", () => {
    sink.value = [...new Set(users.map((user) => user.email))];
  });
});

describe("fused: uniqueBy", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(users, uniqueBy(prop("email")));
  });

  bench("native chain", () => {
    const seen = new Set<string>();
    const result: User[] = [];
    for (const user of users) {
      if (seen.has(user.email)) {
        continue;
      }

      seen.add(user.email);
      result.push(user);
    }
    sink.value = result;
  });
});

describe("short-circuit: filter + map + take", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(
      users,
      filter((user) => user.isActive),
      map((user) => user.name),
      take(10),
    );
  });

  bench("native chain", () => {
    sink.value = users
      .filter((user) => user.isActive)
      .map((user) => user.name)
      .slice(0, 10);
  });
});

describe("short-circuit: find", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(
      users,
      find((user) => user.id === 25),
    );
  });

  bench("native chain", () => {
    sink.value = users.find((user) => user.id === 25);
  });
});

describe("short-circuit: filter + first", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(
      users,
      filter((user) => user.age > 60),
      first(),
    );
  });

  bench("native chain", () => {
    sink.value = users.find((user) => user.age > 60);
  });
});

describe("single step: map", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(
      users,
      map((user) => user.name),
    );
  });

  bench("native chain", () => {
    sink.value = users.map((user) => user.name);
  });
});

describe("single step: map reading data", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(
      users,
      map((user, index, data) => data.length - index + user.id),
    );
  });

  bench("native chain", () => {
    sink.value = users.map(
      (user, index, data) => data.length - index + user.id,
    );
  });
});

describe("single step: forEach", () => {
  bench("remeda pipe", () => {
    pipe(
      users,
      forEach((user) => {
        sink.value = user.id;
      }),
    );
  });

  bench("native chain", () => {
    // eslint-disable-next-line unicorn/no-for-each -- The native counterpart of `R.forEach` is `Array.prototype.forEach`; a `for...of` loop would measure a different construct.
    users.forEach((user) => {
      sink.value = user.id;
    });
  });
});

describe("non-lazy control: sortBy + groupBy", () => {
  bench("remeda pipe", () => {
    sink.value = pipe(users, sortBy(prop("age")), groupBy(prop("role")));
  });

  bench("native chain", () => {
    // `Object.groupBy` would express this natively, but it's ES2024 and this
    // package still targets ES2022, so we fall back to a manual accumulation loop.
    const sorted = [...users].sort((a, b) => a.age - b.age);
    const grouped: Partial<Record<Role, User[]>> = {};
    for (const user of sorted) {
      (grouped[user.role] ??= []).push(user);
    }
    sink.value = grouped;
  });
});
