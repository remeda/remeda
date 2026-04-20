import { runCommand } from "./exec.ts";

const GIT_DIFF_ARGS = ["--no-pager", "diff", "--no-index", "--no-color", "--"];

export function diff(
  fileAPath: string,
  fileBPath: string,
  canonicalFilePath = fileBPath,
): string {
  const { stdout, stderr, status } = runCommand({
    cmd: "git",
    args: [...GIT_DIFF_ARGS, fileAPath, fileBPath],
  });
  if (status !== 0 && status !== 1) {
    throw new Error(
      `git diff --no-index failed for ${canonicalFilePath} (exit ${String(status)}): ${stderr}`,
    );
  }

  return stdout
    .split("\n")
    .map((line) => {
      if (line.startsWith("diff --git ")) {
        return `diff --git a/${canonicalFilePath} b/${canonicalFilePath}`;
      }

      if (line.startsWith("--- ")) {
        return `--- a/${canonicalFilePath}`;
      }

      if (line.startsWith("+++ ")) {
        return `+++ b/${canonicalFilePath}`;
      }

      return line;
    })
    .join("\n");
}
