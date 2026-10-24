import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import * as esbuild from "esbuild";

console.log("[build-pages] Starting OpenNext build for Cloudflare Pages...");
execSync("pnpm exec opennextjs-cloudflare build || npx @opennextjs/cloudflare build", {
  stdio: "inherit",
  env: {
    ...process.env,
    SKIP_WRANGLER_CONFIG_CHECK: "yes",
  },
});

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

const openNextDir = path.resolve(process.cwd(), ".open-next");
const assetsDir = path.join(openNextDir, "assets");

console.log("[build-pages] Copying static assets from .open-next/assets...");
copyDirSync(assetsDir, distDir);

console.log("[build-pages] Bundling and minifying worker into single _worker.js...");
const workerEntry = path.join(openNextDir, "worker.js");
const workerOutput = path.join(distDir, "_worker.js");

await esbuild.build({
  entryPoints: [workerEntry],
  outfile: workerOutput,
  bundle: true,
  minify: true,
  format: "esm",
  platform: "node",
  target: "es2022",
  loader: {
    ".bin": "binary",
    ".wasm": "binary",
  },
  external: [
    "node:*",
    "cloudflare:*",
  ],
  logLevel: "info",
});

const stat = fs.statSync(workerOutput);
console.log(`[build-pages] Single _worker.js bundled successfully: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
console.log("[build-pages] Build for Cloudflare Pages ready in .pages-dist!");
