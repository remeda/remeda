import { identity } from "../identity";
import { withPrecision } from "./withPrecision";

it("handles numbers that can only be printed in scientific notation", () => {
  const mockRoundingFn = vi.fn<(input: number) => number>(identity());
  const roundingFn = withPrecision(mockRoundingFn);
  roundingFn(Number.parseFloat("1.23e+45"), 6);

  // Notice the shift in the exponent!
  expect(mockRoundingFn).toHaveBeenCalledWith(Number.parseFloat("1.23e+51"));
});
