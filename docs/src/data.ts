import { flatten, groupBy, map, pipe, values } from "remeda";
import data from "../build/data.json";
import type { FunctionsData } from "../scripts/transform";

export type FunctionData = FunctionsData[number];

const FUNCTIONS_DATA = data as FunctionsData;

export const getTags = (func: FunctionData) => {
  const {
    methods: [method],
  } = func;

  const { pipeable = false, indexed = false, strict = false } = method ?? {};

  const out = [];
  if (pipeable) {
    out.push("pipeable");
  }
  if (indexed) {
    out.push("indexed");
  }
  if (strict) {
    out.push("strict");
  }
  return out;
};

export const NAV_ENTRIES = pipe(
  FUNCTIONS_DATA,
  map((func) => ({
    category: func.category,
    name: func.name,
    tags: getTags(func),
  })),
  groupBy((func) => func.category),
);

export const FUNCTIONS = pipe(
  FUNCTIONS_DATA,
  groupBy((func) => func.category),
  values,
  flatten(),
);
