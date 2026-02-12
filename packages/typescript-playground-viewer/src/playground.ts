import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import type { CompilerOptions } from "typescript";

const TS_CACHE_DIR = path.join(import.meta.dirname, "..", ".ts-cache");

const RE_IMPORT =
  /(?:import|export)\s.*?from\s+["']([^"'./][^"']*)["']|require\(\s*["']([^"'./][^"']*)["']\s*\)/g;

export function runPlayground(
  version: string,
  code: string,
  compilerOptions: Record<string, unknown>,
) {
  const typeScript = loadTypeScript(version);

  // Merge playground defaults with URL overrides, then let TypeScript
  // convert the JSON representation to proper CompilerOptions (enums etc.).
  const { options } = typeScript.convertCompilerOptionsFromJson(
    compilerOptions,
    "." /* basePath */,
  );

  return getDiagnostics(typeScript, code, options);
}

function getDiagnostics(
  ts: typeof import("typescript"),
  code: string,
  compilerOptions: CompilerOptions,
): string {
  const fileName = "playground.ts";

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
      if (name === fileName) {
        return ts.createSourceFile(fileName, code, languageVersionOrOptions);
      }
      return originalGetSourceFile(name, languageVersionOrOptions, ...rest);
    };

    const originalFileExists = host.fileExists.bind(host);
    host.fileExists = (name) => name === fileName || originalFileExists(name);

    const originalReadFile = host.readFile.bind(host);
    host.readFile = (name) =>
      name === fileName ? code : originalReadFile(name);

    // Point module resolution at the temp dir so tsc finds installed packages.
    if (tempDir !== undefined) {
      const dir = tempDir;
      host.getCurrentDirectory = () => dir;
    }

    const program = ts.createProgram([fileName], compilerOptions, host);
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

function loadTypeScript(version: string): typeof import("typescript") {
  const prefix = path.join(TS_CACHE_DIR, version);
  const modulePath = path.join(prefix, "node_modules", "typescript");

  // Install into the cache on first use.
  if (!existsSync(modulePath)) {
    execSync(`npm install --prefix ${prefix} typescript@${version}`, {
      encoding: "utf8",
      stdio: "pipe",
    });
  }

  const require = createRequire(path.join(prefix, "_"));
  return require(modulePath) as typeof import("typescript");
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
