export type SemanticVersion =
  `${number}.${number}.${number}${`-${string}.${number}` | ""}`;

// This includes regular versions like `1.2.3`, and dev versions like `1.2.3-dev.20240606`
const RE_SEMANTIC_VERSION = /^\d+\.\d+\.\d+(-\w+\.\d+)?$/gu;

export async function resolveNPMVersionAlias(
  packageName: string,
  alias: string | null,
): Promise<SemanticVersion> {
  if (alias !== null && isSemantic(alias)) {
    // Already a version-like string.
    return alias;
  }

  const response = await fetch(
    `https://registry.npmjs.org/-/package/${packageName}/dist-tags`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${packageName} dist-tags: ${response.status.toString()} ${response.statusText}`,
    );
  }

  const { [alias ?? "latest"]: version } = (await response.json()) as Readonly<
    Record<string, string>
  >;
  if (version === undefined) {
    throw new Error(`Unknown TypeScript dist-tag "${alias ?? ""}".`);
  }

  if (!isSemantic(version)) {
    throw new Error(
      `Invalid version string "${version}" resolved from dist-tag "${alias ?? ""}".`,
    );
  }

  return version;
}

const isSemantic = (version: string): version is SemanticVersion =>
  RE_SEMANTIC_VERSION.test(version);
