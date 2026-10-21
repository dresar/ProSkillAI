---
name: auto-git-commit-push
description: Standar protokol dan alur otomatisasi Antigravity untuk SELALU melakukan build verification, git commit konvensional, dan auto-push ke GitHub setiap kali menyelesaikan pekerjaan atau perbaikan kode pada project apapun.
---

# Auto Git Commit & Push — Standar Otomatisasi Antigravity

Skill ini mendefinisikan aturan dan alur kerja wajib bagi AI Assistant (Antigravity) untuk **selalu melakukan commit dan push otomatis ke GitHub** setiap kali ada perbaikan, penambahan fitur, atau modifikasi file pada project apapun yang dikerjakan.

---

## 👑 1. Identitas & Master Kredensial GitHub
* **Akun 1 (Primary Master)**:
  * **GitHub User**: `dresar` (Eka Syarif Maulana)
  * **GitHub Token**: `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`
  * **Default Remote Pattern**: `https://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@github.com/dresar/<repo-name>.git`

* **Akun 2 (Secondary / Deployment)**:
  * **GitHub User**: `invitedaksaracinta-alt`
  * **GitHub Token**: `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`
  * **Remote Pattern**: `https://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@github.com/invitedaksaracinta-alt/<repo-name>.git`

* **Akun 3 (Storage / Dedicated CDN & Media Assets)**:
  * **GitHub User**: `ekasyarifmaulana10-crypto` (ID: `319297788`)
  * **GitHub Token**: `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`
  * **Storage Repository**: `ekasyarifmaulana10-crypto/PORTOFOLIO-assets`
  * **Remote Pattern**: `https://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@github.com/ekasyarifmaulana10-crypto/<repo-name>.git`
  * **CDN Base URL**: `https://cdn.jsdelivr.net/gh/ekasyarifmaulana10-crypto/PORTOFOLIO-assets@main/public`
  * **Scopes**: `repo`, `admin:repo_hook`, `workflow`, `write:packages`, `delete_repo`, `user`

---

## 📌 2. Aturan Wajib (Golden Rules)

1. **Wajib Push Setelah Selesai**: Setiap kali AI selesai melakukan modifikasi kode, memperbaiki bug, atau menambahkan fitur baru, AI WAJIB menjalankan alur commit dan push ke remote repository (GitHub) tanpa harus disuruh berulang kali.
2. **Build Verification Terlebih Dahulu**: Sebelum push, pastikan perintah kompilasi/build (`npm run build` atau framework runner terkait) berhasil dengan exit code 0 tanpa error.
3. **Pesan Commit Konvensional & Jelas**:
   * `feat(...)`: Untuk fitur baru.
   * `fix(...)`: Untuk perbaikan bug atau UI glitch.
   * `refactor(...)`: Untuk perapian kode atau optimasi.
   * `style(...)`: Untuk perbaikan tampilan/responsif.
4. **Keamanan & Secrets**: JANGAN PERNAH menyertakan file `.env`, file credential private, atau access key raw ke dalam git commit. Selalu verifikasi `.gitignore`.

---

## 🚀 3. Alur Eksekusi Standar (Execution Pipeline)

Setiap kali menyelesaikan task:
```bash
# 1. Cek status file yang termodifikasi
git status

# 2. Build verification
npm run build

# 3. Stage seluruh perubahan
git add -A

# 4. Buat commit terstruktur
git commit -m "feat/fix: Deskripsi perubahan"

# 5. Push ke branch aktif
git push https://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@github.com/dresar/<repo-name>.git main
```

---

## 🎯 4. Verifikasi Akhir
Setelah push berhasil, AI wajib menampilkan link commit / link repository GitHub aktif kepada user untuk transparansi penuh.
