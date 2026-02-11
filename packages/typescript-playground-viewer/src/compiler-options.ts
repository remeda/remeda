import { fromEntries, mapValues, omit, pipe } from "remeda";

// The playground encodes enum options as numeric strings. These maps translate
// them back to the string values tsconfig.json expects.
const ENUM_MAPS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  target: {
    1: "ES5",
    2: "ES2015",
    3: "ES2016",
    4: "ES2017",
    5: "ES2018",
    6: "ES2019",
    7: "ES2020",
    8: "ES2021",
    9: "ES2022",
    10: "ES2023",
    99: "ESNext",
  },
  module: {
    0: "None",
    1: "CommonJS",
    2: "AMD",
    3: "UMD",
    4: "System",
    5: "ES2015",
    6: "ES2020",
    7: "ES2022",
    99: "ESNext",
    100: "Node16",
    199: "NodeNext",
  },
  moduleResolution: {
    1: "Classic",
    2: "Node",
    3: "Node16",
    99: "NodeNext",
    100: "Bundler",
  },
  jsx: {
    1: "preserve",
    2: "react",
    3: "react-native",
    4: "react-jsx",
    5: "react-jsxdev",
  },
} satisfies Record<string, Record<`${number}`, string>>;

const SERIALIZED_BOOLEAN: Readonly<Record<string, boolean>> = {
  true: true,
  false: false,
} as const;

// Playground UI params that aren't compiler options.
const IGNORED_PARAMS = ["ts", "filetype", "install-plugin"] as const;

// Defaults from the TypeScript playground source code:
// https://github.com/microsoft/TypeScript-Website/blob/v2/packages/sandbox/src/compilerOptions.ts
const PLAYGROUND_DEFAULT_OPTIONS = {
  // Type checking
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  strictFunctionTypes: true,
  strictPropertyInitialization: true,
  strictBindCallApply: true,
  noImplicitThis: true,
  noImplicitReturns: true,
  noUncheckedIndexedAccess: false,
  useDefineForClassFields: false,
  alwaysStrict: true,
  allowUnreachableCode: false,
  allowUnusedLabels: false,
  noStrictGenericChecks: false,
  noUnusedLocals: false,
  noUnusedParameters: false,

  // Modules
  module: "ESNext",
  moduleResolution: "Node",
  esModuleInterop: true,

  // Emit
  downlevelIteration: false,
  noEmitHelpers: false,
  noEmit: true,
  declaration: true,
  preserveConstEnums: false,
  removeComments: false,
  importHelpers: false,

  // Environment
  target: "ES2017",
  jsx: "react",
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  lib: ["ES2017", "DOM"],

  // Other
  noLib: false,
  skipLibCheck: false,
  checkJs: false,
  allowJs: false,
} as const;

export function computeCompilerOptions(
  searchParams: URLSearchParams,
): Record<string, unknown> {
  const overrides = pipe(
    [...searchParams.entries()],
    fromEntries(),
    mapValues(
      (value, key) =>
        ENUM_MAPS[key]?.[value] ?? SERIALIZED_BOOLEAN[value] ?? value,
    ),
    omit(IGNORED_PARAMS),
  );

  return { ...PLAYGROUND_DEFAULT_OPTIONS, ...overrides };
}
