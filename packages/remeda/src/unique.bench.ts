import { bench, describe } from "vitest";
import { unique } from "./unique";

const EMAIL_COUNT = 1000;

// Emails repeat every 700 ids so there's real duplicate-removal work to do.
const emails: readonly string[] = Array.from(
  { length: EMAIL_COUNT },
  (_, index) => `user${index % 700}@example.com`,
);

// Every bench body only performs the measured call and assigns the result
// here, so V8 can't dead-code-eliminate the work. Using an object (instead of
// a bare variable) means the property write escapes and TypeScript doesn't
// flag it as an unused local under `noUnusedLocals`.
const sink: { value: unknown } = { value: undefined };

describe("data-first: unique", () => {
  bench("remeda pipe", () => {
    sink.value = unique(emails);
  });

  bench("native chain", () => {
    sink.value = [...new Set(emails)];
  });
});
