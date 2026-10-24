import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

console.log("[build-pages] Starting Next.js build...");
execSync("pnpm build || npm run build", { stdio: "inherit" });

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

console.log("[build-pages] Copying public assets...");
copyDirSync(path.resolve(process.cwd(), "public"), distDir);

console.log("[build-pages] Copying .next/static assets...");
copyDirSync(
  path.resolve(process.cwd(), ".next/static"),
  path.join(distDir, "_next", "static")
);

const workerCode = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (env.ASSETS) {
      try {
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.status < 400) {
          return assetResponse;
        }
      } catch {}
    }

    const targetUrl = new URL(request.url);
    targetUrl.hostname = "proskillai.agentai.my.id";
    targetUrl.protocol = "https:";
    targetUrl.port = "443";

    const headers = new Headers(request.headers);
    headers.set("x-forwarded-host", url.host);
    headers.set("x-forwarded-proto", url.protocol.replace(":", ""));

    const init = {
      method: request.method,
      headers,
      redirect: "manual"
    };

    if (request.method !== "GET" && request.method !== "HEAD" && request.body) {
      init.body = request.body;
      init.duplex = "half";
    }

    try {
      const response = await fetch(targetUrl.toString(), init);
      const resHeaders = new Headers(response.headers);
      
      const location = resHeaders.get("location");
      if (location && location.includes("proskillai.agentai.my.id")) {
        resHeaders.set("location", location.replace("https://proskillai.agentai.my.id", url.origin));
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: resHeaders
      });
    } catch (err) {
      return new Response("Origin Connection Error: " + (err?.message || err), { status: 502 });
    }
  }
};
`;

fs.writeFileSync(path.join(distDir, "_worker.js"), workerCode, "utf8");
console.log("[build-pages] Generated _worker.js and static assets in .pages-dist successfully!");
