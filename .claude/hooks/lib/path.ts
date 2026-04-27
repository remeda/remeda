import path from "node:path";
import { env } from "node:process";

export function getPackageDirectory(
  packageName: "docs" | "remeda" | "stackblitz-template",
): string {
  if (
    env["CLAUDE_PROJECT_DIR"] === undefined ||
    env["CLAUDE_PROJECT_DIR"] === ""
  ) {
    throw new Error("Required env variable CLAUDE_PROJECT_DIR is not set");
  }

  return path.resolve(env["CLAUDE_PROJECT_DIR"], "packages", packageName);
}
