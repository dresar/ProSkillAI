import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

console.log("[build-pages] Starting OpenNext build for Cloudflare Pages...");
execSync("pnpm exec opennextjs-cloudflare build || npx @opennextjs/cloudflare build", { stdio: "inherit" });

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

console.log("[build-pages] Copying OpenNext worker dependencies into .pages-dist...");
const dirsToCopy = [
  "cloudflare",
  "cloudflare-templates",
  "middleware",
  "server-functions",
  ".build",
  "dynamodb-provider",
  "cache",
];

for (const dir of dirsToCopy) {
  const src = path.join(openNextDir, dir);
  if (fs.existsSync(src)) {
    copyDirSync(src, path.join(distDir, dir));
  }
}

const workerSrc = path.join(openNextDir, "worker.js");
const workerDest = path.join(distDir, "_worker.js");
if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, workerDest);
  console.log("[build-pages] Copied worker.js to _worker.js successfully!");
} else {
  throw new Error("[build-pages] Missing .open-next/worker.js!");
}

console.log("[build-pages] Build for Cloudflare Pages ready in .pages-dist!");
