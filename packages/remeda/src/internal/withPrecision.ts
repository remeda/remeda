// ECMAScript doesn't support more decimal places than 15 anyways,
// so supporting higher values doesn't make a lot of sense,
// Considering Number.MAX_SAFE_INTEGER < 10**16, we can use -15
// for the negative precision limit, too.
const MAX_PRECISION = 15;

const RADIX = 10;

export const withPrecision =
  (roundingFn: (value: number) => number) =>
  (value: number, precision: number): number => {
    if (precision === 0) {
      return roundingFn(value);
    }

    if (!Number.isInteger(precision)) {
      throw new TypeError(
        `precision must be an integer: ${precision.toString()}`,
      );
    }

    if (precision > MAX_PRECISION || precision < -MAX_PRECISION) {
      throw new RangeError("precision must be between -15 and 15");
    }

    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return roundingFn(value);
    }

    const shiftedValue = shiftExponent(value, precision);
    const rounded = roundingFn(shiftedValue);
    return shiftExponent(rounded, -precision);
  };

function shiftExponent(value: number, shift: number): number {
  const asString = value.toString();
  const [n, exponent] = asString.split("e");

  const shiftedExponent =
    (exponent === undefined ? 0 : Number.parseInt(exponent, RADIX)) + shift;

  const shiftedValueAsString = `${n!}e${shiftedExponent.toString()}`;

  return Number.parseFloat(shiftedValueAsString);
}
