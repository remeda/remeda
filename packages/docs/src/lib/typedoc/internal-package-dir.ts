import fs from "node:fs/promises";
import { findPackageJSON } from "node:module";
import path from "node:path";
import invariant from "tiny-invariant";

export async function internalPackageDir(packageName: string): Promise<string> {
  const packageJsonLocation = findPackageJSON(packageName, import.meta.url);
  invariant(
    packageJsonLocation !== undefined,
    `Couldn't find root for package ${packageName}`,
  );

  // We assume the package.json is in the package root.
  const root = path.dirname(packageJsonLocation);

  // The package is a symlink under the root node_modules. typedoc requires that
  // we provide a real path.
  return await fs.realpath(root);
}
