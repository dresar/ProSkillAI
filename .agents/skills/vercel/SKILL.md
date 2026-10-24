---
name: vercel
description: Master Vercel Deployment & Management Hub. Sistem otomatisasi deployment, manajemen project, environment variables, DNS, dan integrasi GitHub ke Vercel untuk Eka Syarif Maulana (ekasyarifmaulana10@gmail.com). Gunakan saat mendeploy website, mengelola project, atau mensinkronkan domain di Vercel.
---

# Vercel Master Management & Deployment Hub

Pusat kendali otomatisasi deployment Next.js, manajemen project, environment variables, dan domain di Vercel di bawah akun resmi Eka Syarif Maulana.

---

## 1. Identitas & Kredensial Akun

| Atribut | Nilai |
| :--- | :--- |
| **User ID** | `gaWOvpLC871r2BQ7IZtoPZW6` |
| **Username** | `ekasyarifmaulana10-9127` |
| **Email** | `ekasyarifmaulana10@gmail.com` |
| **Team ID** | `team_GmyqSGjxiJvvRHFE5SNoi8FT` |
| **Team Slug** | `ekasyarifmaulana10-9127` |
| **Team Name** | `ekasyarifmaulana10-9127's projects` |
| **API Token** | Tersimpan di `.env` (`VERCEL_TOKEN`) & Global Skill `~/.gemini/config/skills/vercel/SKILL.md` |
| **REST API Base** | `https://api.vercel.com` |

---

## 2. Standar Autentikasi API

Semua request REST API Vercel menyertakan header:
```http
Authorization: Bearer $VERCEL_TOKEN
Content-Type: application/json
```
Sertakan query parameter `?teamId=team_GmyqSGjxiJvvRHFE5SNoi8FT` untuk operasi ber-scope tim.
