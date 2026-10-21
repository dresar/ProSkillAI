---
name: env-secrets-management
description: Standar Master Keamanan Kredensial, Secrets Management, dan Proteksi File .env. Melarang keras hardcoding secret/token apapun di codebase, mewajibkan penggunaan process.env dan .env eksklusif, serta aturan sanitasi git commit.
---

# Master Environment & Secrets Management Standard (`/env-secrets-management`)

Owner & Authority: **Eka Syarif Maulana** (`eka.ckp16799@gmail.com`)

Skill ini menegakkan kepatuhan 100% terhadap perlindungan kunci rahasia, API Token, Private Key, JWT Token, kredensial database, dan konfigurasi sensitif lainnya di seluruh project.

---

## 🚫 1. LARANGAN KERAS (ZERO TOLERANCE)

1. **Dilarang Menaruh Secret di Source Code:**
   * Dilarang keras menuliskan raw token, API key, password database, atau string kredensial sensitif di file kode (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.vue`, `.php`, `.py`, dll.).
   * Dilarang memberikan string fallback berisi token nyata (contoh salah: `process.env.TOKEN || "ghp_xxxx"`). Fallback untuk string token WAJIB string kosong `""` atau melempar error konfigurasi.

2. **Dilarang Mengunggah / Meng-commit File `.env` ke Git:**
   * File `.env`, `.env.local`, `.env.production` yang berisi nilai rahasia asli WAJIB masuk ke `.gitignore`.
   * Hanya file template `.env.example` tanpa nilai rahasia asli yang boleh di-commit.

3. **Dilarang Mengekspos Secret ke Sisi Klien (Frontend/Browser):**
   * Token sensitif backend (GitHub Personal Access Token, Neon Secret, Mayar Webhook Token, Redis Token, Cloudflare Global API Key) HANYA boleh dipanggil di lingkungan server (`src/server/` atau server functions).
   * Dilarang mengekspos token admin ke variabel publik `NEXT_PUBLIC_*` atau `VITE_*` kecuali untuk URL publik yang memang ditujukan untuk browser.

---

## 🛡️ 2. STANDAR PENGGUNAAN `.env` YANG BENAR

1. **Deklarasi Kredensial di File `.env`:**
   Semua variabel wajib didefinisikan di `.env` root project:
   ```env
   # Database Neon
   DATABASE_URL=postgresql://...

   # Upstash Redis
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...

   # Mayar Payment Gateway
   MAYAR_API_KEY=...
   MAYAR_WEBHOOK_TOKEN=...
   MAYAR_BASE_URL=https://api.mayar.id/hl/v1

   # GitHub CDN & Storage
   GITHUB_STORAGE_TOKEN=ghp_...
   GITHUB_STORAGE_OWNER=ponpesraudhatussalammahato-hue
   GITHUB_STORAGE_REPO=wedding-cdn
   GITHUB_STORAGE_BRANCH=main

   # Cloudflare
   CLOUDFLARE_ACCOUNT_ID=...
   CLOUDFLARE_API_TOKEN=...
   ```

2. **Cara Membaca di Kode Backend / Server:**
   ```typescript
   // Selalu baca langsung dari process.env dengan fallback kosong atau error handling
   const TOKEN = process.env.GITHUB_STORAGE_TOKEN || "";
   const OWNER = process.env.GITHUB_STORAGE_OWNER || "ponpesraudhatussalammahato-hue";
   const REPO = process.env.GITHUB_STORAGE_REPO || "wedding-cdn";
   const BRANCH = process.env.GITHUB_STORAGE_BRANCH || "main";

   if (!TOKEN) {
       console.warn("GITHUB_STORAGE_TOKEN is not configured in environment variables.");
   }
   ```

3. **Penyuntikan Environment Variable pada Cloudflare Pages / Serverless:**
   * Saat deploy ke platform serverless seperti Cloudflare Pages atau Vercel, variabel rahasia disuntikkan melalui CLI / API / Dashboard environment variables, BUKAN di-hardcode ke file source code.
   * **INVARIAN CLOUDFLARE PAGES**: `wrangler pages deploy` tidak mengikutsertakan `.env`. Seluruh secrets di `.env` WAJIB disinkronkan ke Cloudflare Pages Project Configuration via API (`PATCH /accounts/{account_id}/pages/projects/{project_name}`) sebelum aplikasi berjalan di production. Tanpa ini, backend runtime akan mengalami kegagalan silent (misal: ORM fallback ke array kosong).

---

## 🔍 3. PROTOKOL AUDIT SEBELUM GIT COMMIT & PUSH

Sebelum melakukan `git commit` dan `git push`, AI / Developer WAJIB melakukan audit keamanan:
1. Scan ripgrep untuk mendeteksi pola token:
   * `ghp_` (GitHub Token)
   * `cfat_` (Cloudflare Token)
   * `sk_` / `eyJh` (API Keys / JWTs)
   * `postgresql://.*:.*@` (Database URIs dengan password raw)
2. Pastikan file `.env` berada dalam `.gitignore`.
3. Pastikan tidak ada kredensial raw di file skrip sementara (`scripts/`).
