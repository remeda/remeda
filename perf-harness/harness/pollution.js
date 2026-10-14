// JIT pollution profiles, applied identically to every copy loaded into the
// process before anything is measured:
//
//   P0  none: every call site starts with the scenario's own feedback only.
//   P1  only map / filter / find / take (in pipes, data-first and data-last),
//       over items of 10 hidden classes, so the item-facing sites inside the
//       library (the branch's control-object check among them) go
//       megamorphic while everything else stays clean.
//   P2  the uniform pass (default): a port of
//       `packages/remeda/test/benchPollution.ts` (branch) that takes the copy
//       to drive as a namespace object. The `repo*` functions reproduce the
//       repo pass call for call (same inputs, shapes, arities and ROUNDS); the
//       `extended*` functions add the entry points the scenario matrix
//       exercises that the repo pass doesn't: data-first calls of the
//       `purryWithLazy` utilities, the non-lazy `purry` utilities used by the
//       scenarios (both styles), `piped`, and data-last calls outside a pipe.

const INTEGERS = [3, 1, 4, 1, 5, 9, 2, 6];
const DOUBLES = [3.5, 1.25, 4.75, 1.25, 5.5, 9.125];
const STRINGS = ["delta", "alpha", "charlie", "alpha", "bravo"];

const RECORDS = [
  { id: 3, name: "delta" },
  { id: 1, name: "alpha" },
  { id: 4, name: "charlie" },
  { id: 1, name: "alpha" },
];

const MIXED = [1, "two", 3.5, true, RECORDS[0], INTEGERS];

const SHAPES = [
  { id: 1 },
  { id: 2, name: "b" },
  { name: "c", id: 3 },
  { id: 4, name: "d", age: 40 },
  { id: 5, age: 50, extra: true },
  { label: "f", id: 6, age: 60, tags: STRINGS },
  { age: 70 },
];

const INTEGER_SET = new Set(INTEGERS);

const TEXT = "abracadabra";

const OTHER_INTEGERS = [1, 2, 7];
const OTHER_RECORDS = [{ id: 1, name: "alpha" }];

function* generateIntegers() {
  yield* INTEGERS;
}

const sink = { value: undefined };

export const ROUNDS = 300;

export const POLLUTION_PROFILES = ["P0", "P1", "P2"];

/** Drives one library copy through the given profile, ROUNDS times. */
export function pollute(lib, profile = "P2") {
  switch (profile) {
    case "P0": {
      return;
    }
    case "P1": {
      for (let round = 0; round < ROUNDS; round++) {
        manyShapes(lib);
      }
      return;
    }
    case "P2": {
      for (let round = 0; round < ROUNDS; round++) {
        repoSingleSteps(lib);
        repoMultiSteps(lib);
        repoIterableKinds(lib);
        repoObjectShapes(lib);
        repoDataFirst(lib);
        extendedDataFirstWithLazy(lib);
        extendedNonLazyPurry(lib);
        extendedPipedAndDataLast(lib);
      }
      return;
    }
    default: {
      throw new Error(`Unknown pollution profile ${profile}`);
    }
  }
}

// --- P1 -----------------------------------------------------------------------

class ShapeItem {
  constructor(id) {
    this.id = id;
    this.kind = "instance";
  }
}

// Ten hidden classes: eight object-literal shapes, an array and a class
// instance. V8's inline caches go megamorphic past four.
const TEN_SHAPES = [
  { id: 1 },
  { id: 2, name: "b" },
  { name: "c", id: 3 },
  { id: 4, age: 40 },
  { age: 50, id: 5 },
  { id: 6, name: "f", age: 60 },
  { tags: STRINGS, id: 7 },
  { x: 8, y: 8, id: 8 },
  [9, 9],
  new ShapeItem(10),
];

function manyShapes({ pipe, map, filter, find, take }) {
  sink.value = pipe(
    TEN_SHAPES,
    map((item) => item),
  );
  sink.value = pipe(
    TEN_SHAPES,
    filter((item) => item !== null),
  );
  sink.value = pipe(
    TEN_SHAPES,
    find((item) => item === TEN_SHAPES[9]),
  );
  sink.value = pipe(TEN_SHAPES, take(7));
  sink.value = pipe(
    TEN_SHAPES,
    map((item) => item),
    filter((item) => item !== null),
    take(8),
  );
  sink.value = pipe(
    TEN_SHAPES,
    filter((item) => typeof item === "object"),
    find((item) => item === TEN_SHAPES[8]),
  );
  sink.value = map(TEN_SHAPES, (item) => item);
  sink.value = filter(TEN_SHAPES, (item) => item !== null);
  sink.value = find(TEN_SHAPES, (item) => item === TEN_SHAPES[5]);
  sink.value = take(TEN_SHAPES, 3);
  sink.value = map((item) => item)(TEN_SHAPES);
  sink.value = filter((item) => item !== null)(TEN_SHAPES);
}

function repoSingleSteps({
  pipe,
  map,
  filter,
  flatMap,
  forEach,
  find,
  first,
  take,
  drop,
  flat,
  unique,
  uniqueBy,
  uniqueWith,
  difference,
  differenceWith,
  intersection,
  intersectionWith,
  zip,
  zipWith,
  mapWithFeedback,
}) {
  // One parameter.
  sink.value = pipe(
    INTEGERS,
    map((value) => value * 2),
  );
  sink.value = pipe(
    DOUBLES,
    map((value) => value + 0.5),
  );
  sink.value = pipe(
    STRINGS,
    map((value) => value.toUpperCase()),
  );
  sink.value = pipe(
    RECORDS,
    map((record) => record.name),
  );
  sink.value = pipe(
    MIXED,
    map((value) => typeof value),
  );
  sink.value = pipe(
    INTEGERS,
    filter((value) => value % 2 === 0),
  );
  sink.value = pipe(
    STRINGS,
    filter((value) => value.startsWith("a")),
  );
  sink.value = pipe(
    RECORDS,
    flatMap((record) => [record.id, record.id + 1]),
  );
  sink.value = pipe(
    STRINGS,
    flatMap((value) => value),
  );
  sink.value = pipe(
    INTEGERS,
    forEach((value) => {
      sink.value = value;
    }),
  );
  sink.value = pipe(
    RECORDS,
    find((record) => record.id === 4),
  );
  sink.value = pipe(
    INTEGERS,
    find((value) => value > 100),
  );
  sink.value = pipe(INTEGERS, first());
  sink.value = pipe(INTEGERS, take(3));
  sink.value = pipe(INTEGERS, take(0));
  sink.value = pipe(DOUBLES, drop(2));
  sink.value = pipe([INTEGERS, DOUBLES], flat());
  sink.value = pipe([[INTEGERS], [DOUBLES]], flat(2));
  sink.value = pipe(INTEGERS, unique());
  sink.value = pipe(
    RECORDS,
    uniqueBy((record) => record.name),
  );
  sink.value = pipe(
    RECORDS,
    uniqueWith((a, b) => a.id === b.id),
  );
  sink.value = pipe(INTEGERS, difference(OTHER_INTEGERS));
  sink.value = pipe(
    RECORDS,
    differenceWith(OTHER_RECORDS, (a, b) => a.id === b.id),
  );
  sink.value = pipe(INTEGERS, intersection(OTHER_INTEGERS));
  sink.value = pipe(
    RECORDS,
    intersectionWith(OTHER_RECORDS, (a, b) => a.id === b.id),
  );
  sink.value = pipe(INTEGERS, zip(DOUBLES));
  sink.value = pipe(
    INTEGERS,
    zipWith(DOUBLES, (a, b) => a + b),
  );
  sink.value = pipe(
    INTEGERS,
    mapWithFeedback((total, value) => total + value, 0),
  );

  // Two parameters.
  sink.value = pipe(
    INTEGERS,
    map((value, index) => value + index),
  );
  sink.value = pipe(
    STRINGS,
    filter((value, index) => index < value.length),
  );
  sink.value = pipe(
    RECORDS,
    flatMap((record, index) => [record.id, index]),
  );
  sink.value = pipe(
    INTEGERS,
    find((value, index) => value === index),
  );

  // Three parameters, which also turns on the `data` buffer.
  sink.value = pipe(
    INTEGERS,
    map((value, index, data) => data.length - index + value),
  );
  sink.value = pipe(
    DOUBLES,
    filter((value, index, data) => value > index && data.length > 0),
  );
  sink.value = pipe(
    RECORDS,
    forEach((record, index, data) => {
      sink.value = data.length + index + record.id;
    }),
  );
  sink.value = pipe(
    STRINGS,
    flatMap((value, index, data) => [value, `${index}/${data.length}`]),
  );
}

function repoMultiSteps({
  pipe,
  map,
  filter,
  flatMap,
  take,
  first,
  unique,
  drop,
  find,
}) {
  sink.value = pipe(
    RECORDS,
    filter((record) => record.id > 1),
    map((record) => record.name),
  );
  sink.value = pipe(
    INTEGERS,
    map((value) => value * 3),
    filter((value) => value > 5),
    map(String),
  );
  sink.value = pipe(
    RECORDS,
    flatMap((record) => [record.id, record.id]),
    filter((value) => value !== 1),
    take(3),
  );
  sink.value = pipe(
    INTEGERS,
    map((value) => value + 1),
    filter((value) => value % 2 === 0),
    first(),
  );
  sink.value = pipe(
    DOUBLES,
    map((value) => value * 1.5),
    unique(),
    drop(1),
    take(2),
  );
  sink.value = pipe(
    STRINGS,
    map((value) => value.length),
    filter((length) => length > 4),
    map((length) => length * 2),
    filter((length) => length < 20),
    map((length) => length + 1),
    find((length) => length > 0),
  );

  // Non-lazy steps between lazy ones split the run into separate sequences.
  sink.value = pipe(
    RECORDS,
    map((record) => record.id),
    (values) => [...values].sort((a, b) => a - b),
    filter((value) => value > 1),
  );
  sink.value = pipe(
    INTEGERS,
    (values) => values.slice(1),
    map((value) => value * 2),
    (values) => values.length,
  );
}

const ITERABLE_FACTORIES = [
  () => INTEGERS,
  () => STRINGS,
  () => INTEGER_SET,
  () => generateIntegers(),
  () => TEXT,
];

function repoIterableKinds({ pipe, map, filter, take, unique }) {
  for (const createIterable of ITERABLE_FACTORIES) {
    sink.value = pipe(
      createIterable(),
      map((value) => `${String(value)}!`),
    );
    sink.value = pipe(
      createIterable(),
      filter((value) => value !== 1),
      take(3),
    );
    sink.value = pipe(createIterable(), unique());
  }

  // A non-iterable input takes the plain-function path for every step.
  sink.value = pipe(
    42,
    (value) => value + 1,
    (value) => value * 2,
    String,
  );
}

function repoObjectShapes({ pipe, map, filter }) {
  for (const shape of SHAPES) {
    sink.value = pipe(
      [shape, shape],
      map((value) => Object.keys(value).length),
    );
    sink.value = pipe(
      [shape, shape],
      filter((value) => "id" in value),
      map((value) => Object.values(value).length),
    );
  }
  sink.value = pipe(
    SHAPES,
    map((value) => value),
    filter((value) => Object.keys(value).length > 1),
    map((value) => value),
  );
}

function repoDataFirst({
  unique,
  uniqueBy,
  uniqueWith,
  difference,
  differenceWith,
  intersection,
  intersectionWith,
  mapWithFeedback,
}) {
  sink.value = unique(INTEGERS);
  sink.value = unique(STRINGS);
  sink.value = uniqueBy(RECORDS, (record) => record.name);
  sink.value = uniqueBy(INTEGERS, (value, index) => value + index);
  sink.value = uniqueWith(RECORDS, (a, b) => a.id === b.id);
  sink.value = difference(INTEGERS, OTHER_INTEGERS);
  sink.value = differenceWith(RECORDS, OTHER_RECORDS, (a, b) => a.id === b.id);
  sink.value = intersection(INTEGERS, OTHER_INTEGERS);
  sink.value = intersectionWith(
    RECORDS,
    OTHER_RECORDS,
    (a, b) => a.id === b.id,
  );
  sink.value = mapWithFeedback(
    DOUBLES,
    (total, value, index) => total + value * index,
    0,
  );
}

// --- Extensions -------------------------------------------------------------

// Data-first calls of the utilities that moved to `purryWithLazy` on the
// branch (an extra hop through `purry`), plus `flat` and `zipWith`, whose
// data-first path is their own dispatch.
function extendedDataFirstWithLazy({
  map,
  filter,
  flatMap,
  forEach,
  find,
  first,
  take,
  drop,
  zip,
  flat,
  zipWith,
}) {
  sink.value = map(INTEGERS, (value) => value * 2);
  sink.value = map(RECORDS, (record) => record.name);
  sink.value = map(STRINGS, (value, index) => value + index);
  sink.value = map(DOUBLES, (value, index, data) => data.length + value);
  sink.value = map(SHAPES, (value) => value);
  sink.value = filter(INTEGERS, (value) => value > 2);
  sink.value = filter(RECORDS, (record, index) => record.id > index);
  sink.value = filter(STRINGS, (value, index, data) => data[index] === value);
  sink.value = filter(SHAPES, (value) => "id" in value);
  sink.value = flatMap(RECORDS, (record) => [record.id, record.name]);
  sink.value = flatMap(INTEGERS, (value, index) => [value, index]);
  sink.value = flatMap(STRINGS, (value) => value);
  sink.value = forEach(INTEGERS, (value) => {
    sink.value = value;
  });
  sink.value = forEach(RECORDS, (record, index, data) => {
    sink.value = data.length + index + record.id;
  });
  sink.value = find(RECORDS, (record) => record.id === 4);
  sink.value = find(INTEGERS, (value, index) => value === index);
  sink.value = find(SHAPES, (value) => "age" in value);
  sink.value = first(INTEGERS);
  sink.value = first(RECORDS);
  sink.value = first(STRINGS);
  sink.value = take(INTEGERS, 3);
  sink.value = take(STRINGS, 1);
  sink.value = take(RECORDS, 0);
  sink.value = drop(DOUBLES, 2);
  sink.value = drop(RECORDS, 1);
  sink.value = drop(SHAPES, 3);
  sink.value = zip(INTEGERS, DOUBLES);
  sink.value = zip(RECORDS, STRINGS);
  sink.value = flat([INTEGERS, DOUBLES]);
  sink.value = flat([[INTEGERS], [DOUBLES]], 2);
  sink.value = flat([RECORDS, SHAPES]);
  sink.value = zipWith(INTEGERS, DOUBLES, (a, b) => a + b);
  sink.value = zipWith(STRINGS, RECORDS, (value, record) => value + record.id);
}

function extendedNonLazyPurry({
  pipe,
  add,
  subtract,
  multiply,
  clamp,
  sortBy,
  groupBy,
  pick,
  omit,
  set,
  merge,
  keys,
  prop,
  chunk,
  sumBy,
  toLowerCase,
}) {
  // Scalars, both styles.
  sink.value = add(1, 2);
  sink.value = add(1.5, 2.25);
  sink.value = add(3)(4);
  sink.value = add(0.5)(4);
  sink.value = subtract(9, 4);
  sink.value = subtract(1.5)(4);
  sink.value = multiply(2, 3);
  sink.value = multiply(2.5)(3);
  sink.value = clamp(12, { min: 0, max: 10 });
  sink.value = clamp(-1.5, { min: 0 });
  sink.value = clamp({ max: 3 })(7);
  sink.value = clamp({ min: 1, max: 2 })(1.5);

  // Arrays, both styles.
  sink.value = sortBy(RECORDS, (record) => record.id);
  sink.value = sortBy(STRINGS, (value) => value.length);
  sink.value = sortBy(INTEGERS, [(value) => value, "desc"]);
  sink.value = sortBy((record) => record.name)(RECORDS);
  sink.value = sortBy((value) => value)(DOUBLES);
  sink.value = groupBy(RECORDS, (record) => record.name);
  sink.value = groupBy(INTEGERS, (value) => (value % 2 === 0 ? "even" : "odd"));
  sink.value = groupBy((value) => value[0])(STRINGS);
  sink.value = groupBy((shape) => Object.keys(shape).length)(SHAPES);
  sink.value = chunk(INTEGERS, 3);
  sink.value = chunk(RECORDS, 2);
  sink.value = chunk(2)(STRINGS);
  sink.value = chunk(4)(SHAPES);
  sink.value = sumBy(RECORDS, (record) => record.id);
  sink.value = sumBy(DOUBLES, (value) => value * 2);
  sink.value = sumBy((value) => value.length)(STRINGS);
  sink.value = sumBy((value, index) => value + index)(INTEGERS);
  for (const value of STRINGS) {
    sink.value = toLowerCase(value);
    sink.value = toLowerCase()(value.toUpperCase());
  }

  // Objects, both styles.
  for (const shape of SHAPES) {
    sink.value = pick(shape, ["id", "name"]);
    sink.value = pick(["age"])(shape);
    sink.value = omit(shape, ["id"]);
    sink.value = omit(["name", "age"])(shape);
    sink.value = set(shape, "id", 0);
    sink.value = set("age", 1)(shape);
    sink.value = merge(shape, { extra: false });
    sink.value = merge({ id: 9 })(shape);
    sink.value = keys(shape);
    sink.value = keys()(shape);
    sink.value = prop(shape, "id");
    sink.value = prop("age")(shape);
  }

  // Pipes of non-lazy functions only, scalar and object.
  sink.value = pipe(5);
  sink.value = pipe(5, add(1));
  sink.value = pipe(5.5, (value) => value * 2);
  sink.value = pipe(5, add(1), multiply(2), clamp({ min: 0, max: 10 }));
  sink.value = pipe(
    2.5,
    subtract(1),
    (value) => value * 3,
    clamp({ min: 1 }),
    add(4),
  );
  sink.value = pipe(RECORDS[0], pick(["id"]), merge({ extra: 1 }), keys());
  sink.value = pipe(SHAPES[3], omit(["age"]), set("id", 2));
  sink.value = pipe(
    RECORDS,
    sortBy((record) => record.id),
    groupBy((record) => record.name),
  );
}

function extendedPipedAndDataLast({
  piped,
  map,
  filter,
  unique,
  uniqueBy,
  take,
  flatMap,
  find,
}) {
  sink.value = piped(
    map((value) => value * 2),
    filter((value) => value > 3),
  )(INTEGERS);
  sink.value = piped(
    filter((record) => record.id > 1),
    map((record) => record.name),
  )(RECORDS);
  sink.value = piped(unique())(STRINGS);
  sink.value = piped(
    map((value) => value),
    take(2),
  )(SHAPES);

  sink.value = map((value) => value + 1)(INTEGERS);
  sink.value = map((record) => record.id)(RECORDS);
  sink.value = map((value, index) => value + index)(STRINGS);
  sink.value = filter((record) => record.id > 1)(RECORDS);
  sink.value = filter((value) => value > 2)(DOUBLES);
  sink.value = filter((shape) => "name" in shape)(SHAPES);
  sink.value = unique()(INTEGERS);
  sink.value = unique()(STRINGS);
  sink.value = uniqueBy((record) => record.id)(RECORDS);
  sink.value = take(2)(STRINGS);
  sink.value = flatMap((record) => [record.id])(RECORDS);
  sink.value = find((value) => value > 3)(INTEGERS);
}
