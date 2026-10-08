// Statistics and the per-tier verdict rules used by scripts/aggregate.mjs.
//
// A "ratio" is candidate/baseline on one scenario's metric in one run (< 1 =
// the candidate is faster). Each run records whether the candidate ran before
// the baseline in its describes ("order").
//
//   Tier 1  regression: the median ratio is beyond the tier's A/A floor
//           (1 + floor) in both orders (candidate-first runs and
//           baseline-first runs, each taken separately); faster: below
//           1 - floor in both orders. With one order only, that order alone
//           decides and the verdict is marked "(one order)".
//   Tier 2  regression: median >= 1.05, every run > 1.00, and median - 1
//           beyond the floor; faster: the mirror image.
//   Tier 3  report only: "slower" / "faster" as tier 2 without the floor;
//           "BLOCK" when every run (at least two) is >= 1.25.

export function quantile(sorted, q) {
  if (sorted.length === 0) {
    return undefined;
  }
  const position = (sorted.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export function distribution(list) {
  const sorted = list
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (sorted.length === 0) {
    return undefined;
  }
  return {
    n: sorted.length,
    median: quantile(sorted, 0.5),
    min: sorted[0],
    max: sorted.at(-1),
    values: sorted,
  };
}

export function geomean(values, weights) {
  let weighted = 0;
  let total = 0;
  for (const [index, value] of values.entries()) {
    if (!Number.isFinite(value) || value <= 0) {
      continue;
    }
    const weight = weights?.[index] ?? 1;
    weighted += weight * Math.log(value);
    total += weight;
  }
  return total === 0 ? undefined : Math.exp(weighted / total);
}

/**
 * A/A noise floor: the p95 of |main-aa/main - 1| over (scenario, run) pairs.
 */
export function noiseFloor(aaRatios) {
  const deviations = aaRatios
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.abs(value - 1))
    .sort((a, b) => a - b);
  if (deviations.length === 0) {
    return undefined;
  }
  return {
    n: deviations.length,
    median: quantile(deviations, 0.5),
    p95: quantile(deviations, 0.95),
    max: deviations.at(-1),
  };
}

/**
 * @param {1|2|3} tier
 * @param {readonly { ratio: number, candidateFirst: boolean }[]} perRun
 * @param {number | undefined} floor - the tier's A/A p95 deviation.
 */
export function verdictFor(tier, perRun, floor) {
  const ratios = perRun.map((row) => row.ratio).filter(Number.isFinite);
  if (ratios.length === 0) {
    return { verdict: "n/a" };
  }
  const all = distribution(ratios);
  const margin = floor ?? 0;
  if (tier === 1) {
    const candidateFirst = distribution(
      perRun.filter((row) => row.candidateFirst).map((row) => row.ratio),
    )?.median;
    const baselineFirst = distribution(
      perRun.filter((row) => !row.candidateFirst).map((row) => row.ratio),
    )?.median;
    const orders = [candidateFirst, baselineFirst].filter(
      (value) => value !== undefined,
    );
    const note = orders.length < 2 ? " (one order)" : "";
    if (orders.every((value) => value > 1 + margin)) {
      return { verdict: "regression", note, candidateFirst, baselineFirst };
    }
    if (orders.every((value) => value < 1 - margin)) {
      return { verdict: "faster", note, candidateFirst, baselineFirst };
    }
    return { verdict: "neutral", note, candidateFirst, baselineFirst };
  }
  const allAbove = ratios.every((value) => value > 1);
  const allBelow = ratios.every((value) => value < 1);
  if (tier === 2) {
    if (all.median >= 1.05 && allAbove && all.median - 1 > margin) {
      return { verdict: "regression" };
    }
    if (all.median <= 0.95 && allBelow && 1 - all.median > margin) {
      return { verdict: "faster" };
    }
    return { verdict: "neutral" };
  }
  // "Consistently" needs at least two runs; one run alone only reports.
  if (ratios.every((value) => value >= 1.25)) {
    return ratios.length >= 2
      ? { verdict: "BLOCK" }
      : { verdict: "slower", note: " (one run, >= 1.25)" };
  }
  if (all.median >= 1.05 && allAbove) {
    return { verdict: "slower" };
  }
  if (all.median <= 0.95 && allBelow) {
    return { verdict: "faster" };
  }
  return { verdict: "neutral" };
}

/** Whether a verdict breaks its tier's bar. */
export function violatesBar(verdict) {
  return verdict === "regression" || verdict === "BLOCK";
}

/**
 * The sign-consistent test for a variant on its target flow: faster than the
 * reference in every run (per-run geomean < 1) and overall geomean <= 0.99.
 *
 * @param {readonly (readonly number[])[]} perRunRatios - per run, the ratios
 *   of the flow's scenarios.
 */
export function signConsistent(perRunRatios, threshold = 0.99) {
  const perRun = perRunRatios
    .map((ratios) => geomean(ratios))
    .filter((value) => value !== undefined);
  const overall = geomean(perRun);
  return {
    runs: perRun.length,
    fasterRuns: perRun.filter((value) => value < 1).length,
    perRun,
    overall,
    fires:
      perRun.length >= 2 &&
      perRun.every((value) => value < 1) &&
      overall !== undefined &&
      overall <= threshold,
  };
}

/**
 * Deterministic pseudo-random numbers (mulberry32), so reports are
 * reproducible.
 */
export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d_2b_79_f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/**
 * The lexicographic comparison: tier 1 first (any tier 1 regression fails the
 * candidate; otherwise the popularity-weighted geomean decides when the two
 * differ by more than the tier's tolerance), then tier 2, then tier 3.
 * Returns < 0 when `a` is better, > 0 when `b` is, 0 for a tie.
 *
 * @param {{ tiers: Record<1|2|3, { regressions: number, geomean?: number }> }} a
 * @param {typeof a} b
 * @param {Record<1|2|3, number>} tolerances - log-ratio tolerance per tier.
 */
export function lexicographicCompare(a, b, tolerances) {
  const aFails = a.tiers[1].regressions > 0;
  const bFails = b.tiers[1].regressions > 0;
  if (aFails !== bFails) {
    return aFails ? 1 : -1;
  }
  for (const tier of [1, 2, 3]) {
    const left = a.tiers[tier].geomean;
    const right = b.tiers[tier].geomean;
    if (left === undefined || right === undefined) {
      continue;
    }
    const difference = Math.log(left) - Math.log(right);
    if (Math.abs(difference) > tolerances[tier]) {
      return difference;
    }
  }
  return 0;
}
