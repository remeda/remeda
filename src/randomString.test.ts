import { randomString } from "./randomString";

test("randomString", () => {
  expect(randomString(10)).toHaveLength(10);
});
