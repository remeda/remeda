import { bench, describe } from "vitest";
import { uniqueWith } from "./uniqueWith";

type User = {
  readonly id: number;
  readonly email: string;
};

const USER_COUNT = 1000;

// Emails repeat every 700 ids so there's real duplicate-removal work to do.
const users: readonly User[] = Array.from(
  { length: USER_COUNT },
  (_, index) => ({
    id: index,
    email: `user${index % 700}@example.com`,
  }),
);

// Every bench body only performs the measured call and assigns the result
// here, so V8 can't dead-code-eliminate the work. Using an object (instead of
// a bare variable) means the property write escapes and TypeScript doesn't
// flag it as an unused local under `noUnusedLocals`.
const sink: { value: unknown } = { value: undefined };

describe("data-first: uniqueWith", () => {
  bench("remeda pipe", () => {
    sink.value = uniqueWith(users, (a, b) => a.email === b.email);
  });

  bench("native chain", () => {
    const result: User[] = [];
    for (const user of users) {
      const existingIndex = result.findIndex(
        (other) => other.email === user.email,
      );
      if (existingIndex === -1) {
        result.push(user);
      }
    }
    sink.value = result;
  });
});
