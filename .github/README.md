# ProSkillAI CI/CD & Automated Deployment Documentation

Panduan lengkap arsitektur Continuous Integration (CI), Continuous Deployment (CD), script auto-update VPS, GitHub Secrets, cron fallback, dan webhook untuk repository ProSkillAI.

---

## 1. Arsitektur Otomatisasi

```mermaid
flowchart TD
    A["Developer Push / PR ke 'main'"] --> B["GitHub Actions: ci.yml"]
    B -->|Check| B1["Typecheck (tsc --noEmit)"]
    B -->|Test| B2["Unit Tests (tsx --test)"]
    B -->|Build| B3["Next.js Build (pnpm build)"]
    
    A -->|Push ke 'main'| C["GitHub Actions: auto-deploy.yml"]
    C --> D{"SSH Secrets Tersedia?"}
    D -->|Ya| E["SSH Dispatch ke VPS"]
    D -->|Tidak| F["Graceful Skip (Log Notice)"]
    
    E --> G["Jalankan scripts/auto-update.sh"]
    H["VPS Cron Job (Tiap 5 Menit)"] --> G
    
    G --> I["git fetch origin main"]
    I --> J{"Ada Commit Baru?"}
    J -->|Tidak| K["Exit 0 (Up to date)"]
    J -->|Ya| L["git reset --hard origin/main"]
    L --> M["pnpm install & pnpm db:push"]
    M --> N["pnpm build"]
    N --> O["Restart Next.js via daemon.sh"]
    O --> P["Zero-Downtime Reload Selesai"]
```

---

## 2. GitHub Actions Workflows

### 2.1 Continuous Integration (`.github/workflows/ci.yml`)

Workflow ini bertugas menjamin integritas kode sebelum diintegrasikan atau di-deploy:
- **Triggers**: `push` ke branch `main`, dan `pull_request` ke branch `main`.
- **Environment**: Ubuntu Latest, Node.js 20, pnpm 11.21.0.
- **Tahapan Eksekusi**:
  1. `actions/checkout@v4`: Mengambil source code terbaru.
  2. `pnpm/action-setup@v4`: Menyiapkan pnpm v11.21.0 sesuai spesifikasi `packageManager`.
  3. `actions/setup-node@v4`: Cache modul pnpm dan inisialisasi runtime Node 20.
  4. `pnpm install --frozen-lockfile || pnpm install`: Instalasi dependensi secara deterministik.
  5. `pnpm typecheck`: Validasi tipe statis TypeScript (`tsc --noEmit`).
  6. `pnpm test`: Menjalankan seluruh test suite unit (`tsx --test tests/**/*.test.ts`).
  7. `pnpm build`: Membangun bundle produksi Next.js dengan environment dummy yang aman.

### 2.2 Auto Deploy (`.github/workflows/auto-deploy.yml`)

Workflow ini memicu deployment otomatis ke server VPS saat terjadi commit baru di `main`:
- **Triggers**:
  - `push` ke `main` (mengabaikan perubahan file dokumentasi `**.md` dan `.github/README.md`).
  - `workflow_dispatch`: Memungkinkan pemicuan manual langsung dari tab Actions GitHub.
- **Graceful Fallback**:
  - Jika secret `SSH_HOST` belum dikonfigurasi di GitHub Repository Settings, workflow tidak akan gagal (`exit 0`), melainkan mencetak panduan instruksi konfigurasi SSH secrets.
- **Remote Execution**:
  - Menggunakan `appleboy/ssh-action@v1.2.0` untuk mengeksekusi `/opt/data/home/proskillai/scripts/auto-update.sh` di VPS target.

---

## 3. Konfigurasi GitHub Secrets

Untuk mengaktifkan push-to-deploy otomatis via SSH, tambahkan secrets berikut di menu **Settings > Secrets and variables > Actions**:

| Secret Name | Deskripsi | Contoh Nilai | Wajib / Opsional |
| :--- | :--- | :--- | :--- |
| `SSH_HOST` | Alamat IP atau hostname VPS | `192.168.1.100` atau `vps.proskillai.dev` | Wajib untuk SSH deploy |
| `SSH_USER` | Username SSH pada server VPS | `hermes` | Wajib untuk SSH deploy |
| `SSH_KEY` | Private SSH Key (ed25519 / RSA) | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Wajib untuk SSH deploy |
| `SSH_PORT` | Port layanan SSH | `22` | Opsional (default: `22`) |
| `DATABASE_URL` | Connection string PostgreSQL untuk prerender SSG saat CI | `postgresql://user:pass@ep-xyz.neon.tech/neondb` | Opsional (default: dummy localhost) |

> **Catatan Keamanan**: Pastikan public key yang sesuai sudah terdaftar di `~/.ssh/authorized_keys` pada VPS target dan file private key tidak dibagikan ke repository.

---

## 4. Script Auto-Update VPS (`scripts/auto-update.sh`)

Script produksi `/opt/data/home/proskillai/scripts/auto-update.sh` bertugas melakukan sinkronisasi lokal di VPS tanpa downtime:

1. **Path & Directory Guard**:
   Menetapkan `PATH` lokal (`/opt/data/home/.local/bin`) dan berpindah ke direktori aplikasi `/opt/data/home/proskillai`.
2. **Hash Diffing**:
   Menjalankan `git fetch origin main` lalu membandingkan `git rev-parse HEAD` dengan `git rev-parse origin/main`. Jika identik, script keluar dengan pesan `Already up to date`.
3. **Penyelarasan Kode**:
   Menjalankan `git reset --hard origin/main` untuk menyelaraskan tree lokal secara bersih tanpa mengubah file lokal yang tidak di-track (`.env`, `server.log`, `daemon.sh`).
4. **Dependensi & Database**:
   - `pnpm install`: Menginstal dependensi baru jika ada penambahan paket.
   - `pnpm db:push`: Menjalankan migrasi skema database Drizzle secara otomatis ke Neon PostgreSQL.
5. **Kompilasi Produksi**:
   - `pnpm build`: Mengompilasi bundle produksi Next.js.
6. **Zero-Downtime Reload**:
   - Karena `daemon.sh` berjalan dalam loop pengawasan `while true; do ./node_modules/.bin/next start -p 3001 -H 127.0.0.1; sleep 2; done`, script mengirimkan sinyal penghentian proses `next start` yang sedang aktif (`pkill -f "next start -p 3001" || true`).
   - Loop `daemon.sh` secara instan membangkitkan instance server Next.js baru dengan hasil build terkini.
   - Jika proses `daemon.sh` tidak terdeteksi, script secara otomatis menghidupkannya via `nohup bash daemon.sh`.

---

## 5. Konfigurasi Cron Job Fallback

Selain pemicuan via GitHub Actions SSH, VPS dapat dikonfigurasi dengan cron job berkala. Ini memastikan server tetap diperbarui bahkan jika koneksi SSH dari GitHub Actions terhalang firewall atau kuota Actions habis.

### Cara Memasang Crontab:

1. Buka editor crontab pada user VPS:
   ```bash
   crontab -e
   ```
2. Tambahkan baris cron job berikut (mengecek update setiap 5 menit):
   ```cron
   */5 * * * * /opt/data/home/proskillai/scripts/auto-update.sh >> /opt/data/home/proskillai/auto-update.log 2>&1
   ```
3. Simpan dan keluar. Verifikasi cron telah aktif:
   ```bash
   crontab -l
   ```

---

## 6. Opsi Webhook Alternatif (Opsional)

Jika server VPS berada di balik NAT tertutup atau akses SSH langsung dibatasi:
1. Pasang service lightweight webhook seperti `adnanh/webhook` di VPS:
   ```bash
   sudo apt-get install webhook
   ```
2. Konfigurasi `/etc/webhook.conf`:
   ```json
   [
     {
       "id": "proskillai-deploy",
       "execute-command": "/opt/data/home/proskillai/scripts/auto-update.sh",
       "command-working-directory": "/opt/data/home/proskillai",
       "trigger-rule": {
         "match": {
           "type": "payload-hmac-sha256",
           "secret": "YOUR_WEBHOOK_SECRET_KEY",
           "parameter": {
             "name": "X-Hub-Signature-256"
           }
         }
       }
     }
   ]
   ```
3. Tambahkan Webhook di GitHub Repository Settings mengarah ke endpoint `https://vps.proskillai.dev:9000/hooks/proskillai-deploy`.

---

## 7. Pengujian dan Troubleshooting Manual

### 7.1 Validasi Sintaks Script
```bash
bash -n scripts/auto-update.sh
```

### 7.2 Eksekusi Manual di VPS
```bash
bash /opt/data/home/proskillai/scripts/auto-update.sh
```

### 7.3 Pemantauan Log Server
```bash
# Log output daemon Next.js
tail -f /opt/data/home/proskillai/server.log

# Log eksekusi cron auto-update
tail -f /opt/data/home/proskillai/auto-update.log
```
