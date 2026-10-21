# ProSkillAI

**Katalog Terkurasi AI Agent Skills & Prompt Engineering Modern**  
*Curated Platform for Modern AI Agent Skills & Prompt Engineering*

---

ProSkillAI adalah platform katalog web serverless berbasis Next.js 16 (App Router), React 19, Tailwind CSS v4, dan Neon Serverless PostgreSQL. Dibangun dengan filosofi desain **Anti-Slop (MONOLIT / ui-modern)** berpalet monokromatik murni, performa tinggi, aksesibilitas penuh (WCAG 2.2 AA), serta dukungan bilingual penuh (*Bahasa Indonesia* sebagai default dan *English*).

Platform ini menyediakan katalog siap pakai untuk AI Skills (standar Claude Code, Antigravity, Aider, Hermes, Cursor) dan Prompts terstruktur dengan mesin substitusi variabel langsung di browser, pratinjau komponen (HTML iframe sandboxed, design tokens swatch, gambar), CMS admin terintegrasi, importir repositori GitHub otomatis berlisensi SPDX, dan audit logging.

---

## Daftar Isi / Table of Contents

- [Filosofi Desain / Design Philosophy](#filosofi-desain--design-philosophy)
- [Fitur Utama / Core Features](#fitur-utama--core-features)
- [Teknologi / Tech Stack](#teknologi--tech-stack)
- [Struktur Direktori / Directory Structure](#struktur-direktori--directory-structure)
- [Panduan Memulai / Getting Started](#panduan-memulai--getting-started)
  - [Prasyarat / Prerequisites](#prasyarat--prerequisites)
  - [Konfigurasi Lingkungan / Environment Variables](#konfigurasi-lingkungan--environment-variables)
  - [Migrasi & Seed Database / Database Setup](#migrasi--seed-database--database-setup)
  - [Menjalankan Development Server](#menjalankan-development-server)
  - [CLI Reset Password Admin](#cli-reset-password-admin)
- [Verifikasi Kualitas / Quality Verification](#verifikasi-kualitas--quality-verification)
- [Panduan Deployment Vercel / Production Deployment](#panduan-deployment-vercel--production-deployment)
- [Aset Brand / Brand Assets](#aset-brand--brand-assets)
- [Lisensi / License](#lisensi--license)

---

## Filosofi Desain / Design Philosophy

ProSkillAI menerapkan standar ketat **Anti-Slop (MONOLIT / ui-modern)**:
- **Palet Monokromatik Murni**: Tidak menggunakan aksen warna ungu, biru neon, atau gradien hiasan. Semua interaksi mengandalkan kontras hitam, putih, dan abu-abu netral (`neutral-50` hingga `neutral-950`) yang teruji rasio kontras WCAG 2.2 AA (minimal 4.5:1 untuk teks normal).
- **Tipografi Presisi**: Antarmuka menggunakan **Geist Sans** dengan hierarki skala tipe terukur. Monospace (**Geist Mono** / sistem mono) secara disiplin hanya digunakan pada blok kode, token, hash SHA, dan path direktori.
- **Micro-Click & Non-Pill Buttons**: Tombol interaktif berbentuk presisi (`rounded-md`, tinggi 36–40px) tanpa tombol kapsul/pill berlebih, dilengkapi efek micro-scale saat ditekan (`active:scale-[0.98]`).
- **View Transitions Theme Switch**: Pergantian tema gelap/terang didukung View Transitions API dengan efek *circular clip-path reveal* halus dan fallback CSS fade instan.
- **Teks Otentik & Tanpa Embel-Embel**: Tanpa angka statistik palsu, tanpa badge penghargaan buatan, tanpa teks lorem ipsum. Seluruh konten katalog merepresentasikan skill dan prompt AI nyata.

---

## Fitur Utama / Core Features

### 1. Katalog Publik & Pencarian Cepat
- **Katalog AI Skills & Prompt Templates**: Menampilkan kartu terstruktur dengan preview visual, kategori, lisensi SPDX, jumlah variabel, dan deskripsi dwibahasa.
- **Toolbar Katalog URL-Driven**: Pencarian instan teks, filter kategori aktif, dan pengurutan (`newest`, `popular`, `title`) tersinkronisasi langsung ke URL query parameters (`?q=`, `?cat=`, `?sort=`).
- **Paginasi & Tag Filter**: Kemudahan navigasi dengan reset filter satu klik.

### 2. Mesin Pratinjau Interaktif (Skill Preview Engine)
- **Sandboxed HTML Iframe**: Menjalankan pratinjau komponen live dengan atribut `sandbox=""` dan isolasi dokumen aman.
- **Design Token Inspector**: Pratinjau palet warna (lengkap dengan mode terang/gelap), tipografi, dan radius token.
- **Image Preview**: Tampilan aset gambar pendukung dengan optimasi Next.js Image.
- **Viewport & Theme Switcher**: Menguji tampilan pada resolusi Desktop (100%) atau Mobile (390px) serta simulasi tema terang/gelap.

### 3. Mesin Substitusi Variabel Prompt (Prompt Variable Engine)
- Form dinamis otomatis mengekstrak variabel format `{{variable_name}}` dari teks prompt.
- Pratinjau hasil kompilasi teks secara real-time saat pengguna mengetik.
- Salin ke clipboard instan dengan notifikasi visual mikro.
- Pilihan salin versi dwibahasa (Bahasa Indonesia atau English).

### 4. Admin CMS Terintegrasi
- **Autentikasi Aman**: Hashing kata sandi berbasis Node.js native `crypto.scrypt`, verifikasi `timingSafeEqual`, sesi cookie HTTP-only berdurasi panjang, dan rate limiting per IP/email.
- **Kelola Skills & Prompts**: Antarmuka penulisan konten dwibahasa dengan live markdown preview, konfigurasi token/iframe pratinjau, dan tombol hapus konfirmasi inline.
- **Kelola Kategori & Pengguna**: Manajemen hierarki kategori serta RBAC (Admin & Editor).
- **Pengaturan & Feature Flags**: Kontrol aktif/nonaktif modul beta publik (Teardowns, Patterns, Guides, Glossary, Tools, Inspirations).
- **Audit Logging**: Pencatatan riwayat setiap aksi administratif (create, update, delete, import).

### 5. GitHub Repository Importer Otomatis
- Pindai repositori publik GitHub langsung dari URL atau format `owner/repo`.
- Menggunakan GitHub Git Trees API untuk mendeteksi seluruh berkas `SKILL.md`.
- Parsing otomatis frontmatter YAML (nama, deskripsi, versi, kompatibilitas agen).
- Verifikasi lisensi repositori berstandar SPDX (MIT, Apache-2.0, BSD, GPL, dll.).
- Impor kandidat skill menjadi draf di database dengan metadata repositori lengkap.

### 6. SEO & Performa Teknis
- Routing dwibahasa terindeks rapi: `/id` (default) dan `/en`.
- `sitemap.xml` dinamis memuat seluruh URL publik yang telah dipublikasikan dengan tag timbal balik `xhtml:link rel="alternate" hreflang="..."`.
- `robots.txt` memblokir crawling direktori privat (`/admin`, `/login`, `/api`).
- Struktur data JSON-LD Schema.org dan OpenGraph lengkap.

---

## Teknologi / Tech Stack

| Lapisan / Layer | Teknologi | Catatan / Notes |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.2 (App Router) | Menggunakan arsitektur `src/proxy.ts` (Next 16 standard) |
| **Core Library** | React 19 & TypeScript Strict | Zero `any`, compiler options ketat |
| **Styling** | Tailwind CSS v4 & PostCSS | Monokromatik murni, token CSS kustom |
| **Database** | Neon Serverless PostgreSQL | Pooled connection untuk serverless runtime |
| **ORM & Migrations**| Drizzle ORM + Drizzle Kit | Skema relasional TypeScript murni |
| **Internationalization** | `next-intl` | Prefix `/id` dan `/en`, translasi 100% sinkron |
| **Theme System** | `next-themes` | View Transitions API circular reveal |
| **Markdown Engine** | `react-markdown` + `remark-gfm` + `rehype-sanitize` | Sanitasi XSS ketat untuk konten markdown |
| **Icons** | `lucide-react` | Ikon minimalis monokromatik |
| **Validation** | `zod` | Skema validasi runtime data formulir |

---

## Struktur Direktori / Directory Structure

```text
ProSkillAI/
├── public/
│   └── brand/
│       ├── logo-mark.svg         # Geometric stacked monogram 'P'
│       ├── logo-full.svg         # Logo monogram + vectorized wordmark
│       └── favicon.svg           # Theme-adaptive SVG favicon
├── src/
│   ├── app/
│   │   ├── [locale]/             # Public localized routes (/, /skills, /prompts, /privacy, /terms)
│   │   ├── admin/                # Admin Panel (overview, skills, prompts, categories, users, settings, activity, github-import)
│   │   ├── login/                # Authentication page & server action
│   │   ├── icon.svg              # Next.js dynamic app icon
│   │   ├── not-found.tsx         # Accessible 404 page
│   │   ├── robots.ts             # Dynamic robots.txt
│   │   └── sitemap.ts            # Dynamic sitemap.xml with reciprocal hreflang
│   ├── components/
│   │   ├── admin-header.tsx      # Admin navigation bar & user profile
│   │   ├── admin-sidebar.tsx     # Admin collapsible drawer navigation
│   │   ├── beta-sections.tsx     # Upcoming modules showcase
│   │   ├── catalog-toolbar.tsx   # Search, filter, and sort bar
│   │   ├── markdown-renderer.tsx # Safe sanitized markdown parser
│   │   ├── prompt-card.tsx       # Standardized prompt card
│   │   ├── prompt-variable-engine.tsx # Live prompt variable substitution & copy
│   │   ├── public-footer.tsx     # Semantic public footer
│   │   ├── public-header.tsx     # Public navbar, drawer, and language switcher
│   │   ├── skill-card.tsx        # Standardized skill card
│   │   ├── skill-preview-viewer.tsx   # Sandboxed iframe / image / token inspector
│   │   ├── theme-provider.tsx    # Next-themes wrapper
│   │   └── theme-toggle.tsx      # View Transitions theme switcher
│   ├── db/
│   │   ├── migrations/           # Drizzle SQL migration files
│   │   ├── index.ts              # Neon client & Drizzle connection
│   │   ├── schema.ts             # Relational database schema
│   │   ├── seed.ts               # Database seeder with initial skills & prompts
│   │   └── reset-password.ts     # CLI password reset utility
│   ├── i18n/
│   │   ├── request.ts            # next-intl server request handler
│   │   └── routing.ts            # i18n routing config
│   ├── lib/
│   │   ├── auth.ts               # scrypt password hashing & session guards
│   │   └── github.ts             # GitHub API integration & SKILL.md parser
│   ├── messages/
│   │   ├── en.json               # English translations
│   │   └── id.json               # Bahasa Indonesia translations
│   └── proxy.ts                  # Next.js 16 proxy middleware for i18n & auth
├── drizzle.config.ts             # Drizzle Kit configuration
├── next.config.ts                # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## Panduan Memulai / Getting Started

### Prasyarat / Prerequisites
- **Node.js**: Versi 20.x atau 22+ (Direkomendasikan Node.js 22 LTS).
- **Pnpm**: Versi 10.x atau 11.x (`corepack enable && corepack prepare pnpm@latest --activate`).
- **PostgreSQL Database**: Disarankan menggunakan [Neon Serverless Postgres](https://neon.tech).

### Konfigurasi Lingkungan / Environment Variables
Salin berkas `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Sesuaikan nilai variabel lingkungan di dalam berkas `.env`:

```env
# Neon PostgreSQL Connection URLs
# DATABASE_URL: Gunakan connection string Pooled untuk deployment serverless
DATABASE_URL=postgresql://user:password@ep-sample-pooler.c-3.region.aws.neon.tech/neondb?sslmode=require

# DATABASE_URL_UNPOOLED: Gunakan direct connection untuk migrasi skema Drizzle
DATABASE_URL_UNPOOLED=postgresql://user:password@ep-sample.c-3.region.aws.neon.tech/neondb?sslmode=require

# Rahasia Sesi Otentikasi (Minimal 32 karakter acak)
AUTH_SECRET=ganti-dengan-string-rahasia-minimal-32-karakter-acak-aman

# Host Aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Token Personal GitHub (Opsional, untuk menaikkan batas rate limit GitHub API saat scan repo)
GITHUB_TOKEN=
```

### Migrasi & Seed Database / Database Setup
Terapkan skema database ke Neon dan isi data awal:

```bash
# 1. Terapkan skema database langsung ke Neon
pnpm run db:push

# 2. Jalankan seeder data awal (admin default, kategori, feature flags, skill, dan prompt)
pnpm run db:seed
```

Akun administrator bawaan setelah seeding:
- **Email**: `admin@proskillai.dev`
- **Password**: `AdminPassword123!`

### Menjalankan Development Server
Jalankan server pengembangan:

```bash
pnpm run dev
```

Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

### CLI Reset Password Admin
Jika Anda perlu mengganti kata sandi admin secara cepat melalui terminal:

```bash
pnpm run reset-password admin@proskillai.dev KataSandiBaruAnda123!
```

---

## Verifikasi Kualitas / Quality Verification

Seluruh kode telah diverifikasi bebas dari error dan warning:

```bash
# Pemeriksaan tipe TypeScript
pnpm run typecheck

# Linter ESLint Next.js & React 19
pnpm run lint

# Kompilasi build produksi Next.js
pnpm run build
```

---

## Panduan Deployment Vercel / Production Deployment

1. **Import Repositori**: Hubungkan repositori GitHub `ProSkillAI` ke Vercel Dashboard.
2. **Framework Preset**: Pilih **Next.js**.
3. **Environment Variables**:
   Tambahkan variabel lingkungan berikut di pengaturan Vercel:
   - `DATABASE_URL`: Connection string **Pooled** dari Neon.
   - `DATABASE_URL_UNPOOLED`: Connection string **Direct** dari Neon.
   - `AUTH_SECRET`: String rahasia acak 32+ karakter.
   - `NEXT_PUBLIC_APP_URL`: Domain produksi Anda (misal `https://proskillai.dev`).
   - `GITHUB_TOKEN`: (Opsional) Token GitHub untuk menaikkan kuota importir.
4. **Deploy**: Klik tombol **Deploy**. Vercel akan menjalankan build Next.js secara otomatis.

---

## Aset Brand / Brand Assets

Aset logo ProSkillAI dirancang secara independen dalam format SVG murni:
- **`public/brand/logo-mark.svg`**: Monogram geometris bertingkat berbentuk huruf 'P' yang melambangkan modularitas skill dan layer kecerdasan buatan. Menggunakan `currentColor` untuk adaptasi tema otomatis.
- **`public/brand/logo-full.svg`**: Kombinasi monogram dan wordmark "ProSkillAI" yang telah dikonversi menjadi kurva vektor murni (`path`), menjamin ketajaman visual tanpa ketergantungan pada font web eksternal.
- **`public/brand/favicon.svg` & `src/app/icon.svg`**: Favicon adaptif terhadap tema sistem melalui media query `@media (prefers-color-scheme: dark)`.

---

## Lisensi / License

Proyek ini dilisensikan di bawah lisensi **MIT License** — silakan gunakan, pelajari, dan kembangkan secara bebas.
