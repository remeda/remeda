import { createLazyInvocationCounter } from "../test/lazy_invocation_counter";
import { find } from "./find";
import { flat } from "./flat";
import { pipe } from "./pipe";

describe("runtime", () => {
  describe("legacy `flatten` equivalent (depth = 1)", () => {
    test("flatten", () => {
      expect(flat([[1, 2], 3, [4, 5]])).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("nested", () => {
      expect(
        flat([
          [1, 2],
          [[3], [4, 5]],
        ]),
      ).toStrictEqual([1, 2, [3], [4, 5]]);
    });

    describe("dataLast", () => {
      test("flatten multiple values", () => {
        expect(pipe([[1, 2], 3, [4, 5]], flat())).toStrictEqual([
          1, 2, 3, 4, 5,
        ]);
      });

      test("flatten single value", () => {
        expect(pipe([[1]], flat())).toStrictEqual([1]);
      });

      test("lazy", () => {
        const counter1 = createLazyInvocationCounter();
        const counter2 = createLazyInvocationCounter();
        const result = pipe(
          [[1, 2], 3, [4, 5]],
          counter1.fn(),
          flat(),
          counter2.fn(),
          find((x) => x - 1 === 2),
        );
        expect(counter1.count).toHaveBeenCalledTimes(2);
        expect(counter2.count).toHaveBeenCalledTimes(3);
        expect(result).toStrictEqual(3);
      });
    });
  });

  describe("legacy `flattenDeep` equivalent (depth = 4)", () => {
    test("flatten", () => {
      expect(flat([[1, 2], 3, [4, 5]], 4)).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("nested", () => {
      expect(
        flat(
          [
            [1, 2],
            [[3], [4, 5]],
          ],
          4,
        ),
      ).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("lazy", () => {
      const counter1 = createLazyInvocationCounter();
      const counter2 = createLazyInvocationCounter();
      const result = pipe(
        [[1, 2], [[3]], [[4, 5]]],
        counter1.fn(),
        flat(4),
        counter2.fn(),
        find((x) => x - 1 === 2),
      );
      expect(counter1.count).toHaveBeenCalledTimes(2);
      expect(counter2.count).toHaveBeenCalledTimes(3);
      expect(result).toStrictEqual(3);
    });
  });
});
