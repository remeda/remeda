/* eslint-disable @typescript-eslint/no-deprecated --
 * The playground still supports legacy TypeScript versions and thus also supports deprecated options and values. This is OK.
 */

import { keys } from "remeda";
import {
  JsxEmit,
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
  type CompilerOptions,
} from "typescript";

// Default compiler options copied from the playground UI.
const PLAYGROUND_DEFAULT_OPTIONS = {
  target: ScriptTarget.ES2017,
  jsx: JsxEmit.React,
  module: ModuleKind.ESNext,

  // Output Formatting
  preserveWatchOutput: false,
  pretty: false,
  noErrorTruncation: false,

  // Emit
  declaration: true,
  inlineSourceMap: false,
  removeComments: false,
  importHelpers: false,
  downlevelIteration: false,
  inlineSources: false,
  stripInternal: false,
  noEmitHelpers: false,
  preserveConstEnums: false,

  // Compiler Diagnostics
  noCheck: false,

  // Interop Constraints
  isolatedModules: false,
  verbatimModuleSyntax: false,
  isolatedDeclarations: false,
  erasableSyntaxOnly: false,
  allowSyntheticDefaultImports: false,
  esModuleInterop: true,

  // Language and Environment
  libReplacement: false,
  experimentalDecorators: false,
  emitDecoratorMetadata: false,
  noLib: false,
  useDefineForClassFields: false,

  // Type Checking
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  strictFunctionTypes: true,
  strictBindCallApply: true,
  strictPropertyInitialization: true,
  strictBuiltinIteratorReturn: false,
  noImplicitThis: true,
  useUnknownInCatchVariables: false,
  alwaysStrict: true,
  noUnusedLocals: false,
  noUnusedParameters: false,
  exactOptionalPropertyTypes: false,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: false,
  noUncheckedIndexedAccess: false,
  noImplicitOverride: false,
  noPropertyAccessFromIndexSignature: false,
  allowUnusedLabels: false,
  allowUnreachableCode: false,

  // Modules
  allowUmdGlobalAccess: false,
  allowImportingTsExtensions: false,
  rewriteRelativeImportExtensions: false,
  resolvePackageJsonExports: false,
  resolvePackageJsonImports: false,
  noUncheckedSideEffectImports: false,
  allowArbitraryExtensions: false,

  // Projects
  disableSourceOfProjectReferenceRedirect: false,

  // Backwards Compatibility
  noImplicitUseStrict: false,
  suppressExcessPropertyErrors: false,
  suppressImplicitAnyIndexErrors: false,
  noStrictGenericChecks: false,
  preserveValueImports: false,
  keyofStringsOnly: false,
} as const satisfies CompilerOptions;

// Defaults from the TypeScript playground source code which are not configurable via the UI.
// @see https://github.com/microsoft/TypeScript-Website/blob/v2/packages/sandbox/src/compilerOptions.ts
const PLAYGROUND_IMPLICIT_DEFAULTS = {
  // Type checking
  moduleResolution: ModuleResolutionKind.NodeJs,

  // Emit
  noEmit: true,

  // Environment
  lib: ["ES2017", "DOM"],

  // Other
  skipLibCheck: false,
  checkJs: false,
  allowJs: false,
} as const satisfies Omit<
  CompilerOptions,
  keyof typeof PLAYGROUND_DEFAULT_OPTIONS
>;

export const computeCompilerOptions = (
  searchParams: URLSearchParams,
): CompilerOptions => ({
  ...PLAYGROUND_DEFAULT_OPTIONS,
  ...PLAYGROUND_IMPLICIT_DEFAULTS,
  ...extractCustomOptions(searchParams),
});

function extractCustomOptions(
  searchParams: URLSearchParams,
): Partial<CompilerOptions> {
  const customOptions: CompilerOptions = {};

  for (const option of keys(PLAYGROUND_DEFAULT_OPTIONS)) {
    // We only allow modifying the options that are available in the UX to begin with, to avoid opening up the query param as a way to inject other settings.
    const value = searchParams.get(option);
    if (value === null) {
      // Option isn't provided in the query.
      continue;
    }

    switch (option) {
      case "target":
        customOptions.target = parseEnum(ScriptTarget, value);
        break;

      case "jsx":
        customOptions.jsx = parseEnum(JsxEmit, value);
        break;

      case "module":
        customOptions.module = parseEnum(ModuleKind, value);
        break;

      default:
        // A boolean option
        if (value === "true") {
          customOptions[option] = true;
        } else if (value === "false") {
          customOptions[option] = false;
        } else {
          throw new Error(
            `Invalid value for boolean compiler option "${option}": expected "true" or "false" but got: ${value}`,
          );
        }
    }
  }

  return customOptions;
}

function parseEnum<E extends Readonly<Record<number, unknown>>>(
  enumObject: E,
  value: string,
): E[keyof E & string] {
  const parsed = Number(value);

  if (!(parsed in enumObject)) {
    throw new Error(
      `Invalid value for enum compiler option, expected: ${JSON.stringify(enumObject)}, got: ${value}`,
    );
  }

  // @ts-expect-error [ts2322] -- TypeScript isn't inferring that parsed is a valid key of E although it satisfies the condition that it is **in** E.
  return parsed;
}
