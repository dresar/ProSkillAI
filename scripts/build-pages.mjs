import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import * as esbuild from "esbuild";

function patchFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  fs.writeFileSync(filePath, content, "utf8");
}

function patchNextFiles() {
  const fsiPath = path.resolve(process.cwd(), "node_modules/next/dist/server/node-environment-extensions/fast-set-immediate.external.js");
  patchFile(fsiPath, [
    [/function\s+install\s*\(\)\s*\{/g, "function install() { return;"],
  ]);
  const cdPath = path.resolve(process.cwd(), "node_modules/next/dist/server/node-environment-extensions/console-dim.external.js");
  patchFile(cdPath, [
    [/require\(["']node:inspector["']\)/g, "({})"],
  ]);
}

patchNextFiles();

console.log("[build-pages] Starting OpenNext build for Cloudflare Pages...");
execSync("pnpm exec opennextjs-cloudflare build || npx @opennextjs/cloudflare build", {
  stdio: "inherit",
  env: {
    ...process.env,
    SKIP_WRANGLER_CONFIG_CHECK: "yes",
  },
});

const openNextDir = path.resolve(process.cwd(), ".open-next");
const handlerPath = path.join(openNextDir, "server-functions/default/handler.mjs");
patchFile(handlerPath, [
  [/function\s+install\s*\(\)\s*\{/g, "function install() { return;"],
  [/require\(["']node:inspector["']\)/g, "({})"],
]);

const distDir = path.resolve(process.cwd(), ".pages-dist");
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const assetsDir = path.join(openNextDir, "assets");

console.log("[build-pages] Copying static assets from .open-next/assets...");
copyDirSync(assetsDir, distDir);

console.log("[build-pages] Preparing static worker entrypoint...");
const workerEntry = path.join(openNextDir, "worker.js");
let workerContent = fs.readFileSync(workerEntry, "utf8");

workerContent = `import { handler as serverHandler } from "./server-functions/default/handler.mjs";\n` + workerContent;
workerContent = workerContent.replace(
  /const\s*\{\s*handler\s*\}\s*=\s*await\s+import\([^)]+\);/g,
  ""
);
workerContent = workerContent.replace(
  /return\s+handler\(/g,
  "return serverHandler("
);

const patchedWorkerEntry = path.join(openNextDir, "worker.static.js");
fs.writeFileSync(patchedWorkerEntry, workerContent, "utf8");

console.log("[build-pages] Bundling and minifying worker into single _worker.js...");
const workerOutput = path.join(distDir, "_worker.js");
const emptyShim = path.resolve(process.cwd(), "scripts/empty-shim.mjs");
const timersShim = path.resolve(process.cwd(), "scripts/timers-shim.mjs");
const timersPromisesShim = path.resolve(process.cwd(), "scripts/timers-promises-shim.mjs");
const fastSetImmediateShim = path.resolve(process.cwd(), "scripts/fast-set-immediate-shim.mjs");

await esbuild.build({
  entryPoints: [patchedWorkerEntry],
  outfile: workerOutput,
  bundle: true,
  minify: true,
  treeShaking: true,
  format: "esm",
  platform: "node",
  target: "es2022",
  banner: {
    js: `import { createRequire as __cr } from "node:module";\nconst require = __cr("/index.js");\n`,
  },
  plugins: [
    {
      name: "cloudflare-shims",
      setup(build) {
        build.onResolve({ filter: /fast-set-immediate/ }, () => ({
          path: fastSetImmediateShim,
        }));
      },
    },
  ],
  alias: {
    "node:timers": timersShim,
    "timers": timersShim,
    "node:timers/promises": timersPromisesShim,
    "timers/promises": timersPromisesShim,
    "node:fs": emptyShim,
    "fs": emptyShim,
    "node:fs/promises": emptyShim,
    "fs/promises": emptyShim,
    "node:child_process": emptyShim,
    "child_process": emptyShim,
    "node:inspector": emptyShim,
    "inspector": emptyShim,
    "node:inspector/promises": emptyShim,
    "inspector/promises": emptyShim,
    "node:net": emptyShim,
    "net": emptyShim,
    "node:dns": emptyShim,
    "dns": emptyShim,
    "node:dns/promises": emptyShim,
    "dns/promises": emptyShim,
    "node:tls": emptyShim,
    "tls": emptyShim,
    "node:v8": emptyShim,
    "v8": emptyShim,
    "node:vm": emptyShim,
    "vm": emptyShim,
    "node:cluster": emptyShim,
    "cluster": emptyShim,
    "node:dgram": emptyShim,
    "dgram": emptyShim,
    "node:http2": emptyShim,
    "http2": emptyShim,
    "node:perf_hooks": emptyShim,
    "perf_hooks": emptyShim,
    "node:readline": emptyShim,
    "readline": emptyShim,
    "node:readline/promises": emptyShim,
    "readline/promises": emptyShim,
    "node:repl": emptyShim,
    "repl": emptyShim,
    "node:tty": emptyShim,
    "tty": emptyShim,
    "node:worker_threads": emptyShim,
    "worker_threads": emptyShim,
    "node:wasi": emptyShim,
    "wasi": emptyShim,
  },
  loader: {
    ".bin": "binary",
    ".wasm": "binary",
  },
  external: [
    "cloudflare:*",
  ],
  logLevel: "info",
});

patchFile(workerOutput, [
  [/function\s+install\s*\(\)\s*\{/g, "function install() { return;"],
  [/require\(["']node:inspector["']\)/g, "({})"],
]);

const stat = fs.statSync(workerOutput);
console.log(`[build-pages] Single _worker.js bundled successfully: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
console.log("[build-pages] Build for Cloudflare Pages ready in .pages-dist!");
