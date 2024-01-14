export function _round(roundingFn: (value: number) => number) {
  return (value: number, precision: number) => {
    if (!Number.isInteger(precision)) {
      throw new TypeError(`precision must be an integer: ${precision}`);
    }

    // ECMAScript doesn't support more decimal places than 15 anyways,
    // so supporting higher values doesn't make a lot of sense,
    // -15 has been set arbitrarily, as Number.MAX_SAFE_INTEGER < 10**16
    if (precision > 15 || precision < -15) {
      throw new RangeError(`precision must be between -15 and 15`);
    }

    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return roundingFn(value);
    }

    const multiplier = 10 ** precision;
    return roundingFn(value * multiplier) / multiplier;
  };
}
