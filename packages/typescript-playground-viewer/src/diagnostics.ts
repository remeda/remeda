import { execSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { CompilerOptions } from "typescript";

const RE_IMPORT =
  /(?:import|export)\s.*?from\s+["']([^"'./][^"']*)["']|require\(\s*["']([^"'./][^"']*)["']\s*\)/g;

const PLAYGROUND_FILENAME = "playground.ts";

export function getDiagnostics(
  ts: typeof import("typescript"),
  code: string,
  compilerOptions: CompilerOptions,
): string {
  // For ATA: if the code imports packages, install them into a temp dir so
  // module resolution can find their types.
  const imports = extractBareImports(code);
  let tempDir: string | undefined;

  if (imports.length > 0) {
    tempDir = mkdtempSync(path.join(tmpdir(), "playground-"));
    writeFileSync(
      path.join(tempDir, "package.json"),
      JSON.stringify({ private: true }),
    );
    installPackages(tempDir, imports);
  }

  try {
    const host = ts.createCompilerHost(compilerOptions);

    // Virtual playground.ts — no need to write it to disk.
    const originalGetSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (name, languageVersionOrOptions, ...rest) => {
      if (name === PLAYGROUND_FILENAME) {
        return ts.createSourceFile(
          PLAYGROUND_FILENAME,
          code,
          languageVersionOrOptions,
        );
      }
      return originalGetSourceFile(name, languageVersionOrOptions, ...rest);
    };

    const originalFileExists = host.fileExists.bind(host);
    host.fileExists = (name) =>
      name === PLAYGROUND_FILENAME || originalFileExists(name);

    const originalReadFile = host.readFile.bind(host);
    host.readFile = (name) =>
      name === PLAYGROUND_FILENAME ? code : originalReadFile(name);

    // Point module resolution at the temp dir so tsc finds installed packages.
    if (tempDir !== undefined) {
      const dir = tempDir;
      host.getCurrentDirectory = () => dir;
    }

    const program = ts.createProgram(
      [PLAYGROUND_FILENAME],
      compilerOptions,
      host,
    );
    const diagnostics = ts.getPreEmitDiagnostics(program);

    if (diagnostics.length === 0) {
      return "";
    }

    // Format diagnostics with just the filename, not full paths.
    return ts
      .formatDiagnostics(diagnostics, {
        getCurrentDirectory: () => "",
        getCanonicalFileName: (f) => f,
        getNewLine: () => "\n",
      })
      .trim();
  } finally {
    if (tempDir !== undefined) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

/**
 * Import detection — replicate the playground's ATA.
 */
function extractBareImports(code: string): string[] {
  // Match import/export specifiers and require() calls that reference bare
  // modules (not relative paths starting with . or /).

  const packages = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = RE_IMPORT.exec(code)) !== null) {
    const specifier = match[1] ?? match[2];
    if (specifier === undefined) {
      continue;
    }

    // Extract the package name: "lodash/fp" → "lodash", "@scope/pkg/sub" → "@scope/pkg"
    const parts = specifier.split("/");
    const name = specifier.startsWith("@")
      ? parts.slice(0, 2).join("/")
      : parts[0];
    if (name !== undefined) {
      packages.add(name);
    }
  }

  return [...packages];
}

function installPackages(dir: string, packages: string[]): void {
  if (packages.length === 0) {
    return;
  }

  const pkgList = packages.join(" ");
  execSync(`npm install --ignore-scripts ${pkgList}`, {
    cwd: dir,
    encoding: "utf8",
    stdio: "pipe",
  });
}
