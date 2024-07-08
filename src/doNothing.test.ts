import { doNothing } from "./doNothing";

describe("runtime", () => {
  test("works", () => {
    const doesNothing = doNothing();
    doesNothing();
  });

  test("works with more than one argument", () => {
    const doesNothing = doNothing();
    doesNothing(1);
    doesNothing(1, 2);
    doesNothing(1, 2, "a");
    doesNothing(undefined);
    doesNothing(["a"]);
  });
});
