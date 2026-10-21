import { randomBytes } from "node:crypto";
import * as dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { hashPassword } from "../lib/auth";
import * as schema from "./schema";

dotenv.config();

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";
if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@proskillai.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "ProSkill2026!Admin";

  const existingUsers = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail));
  let adminId = existingUsers[0]?.id;

  if (!adminId) {
    adminId = randomBytes(16).toString("hex");
    const passwordHash = await hashPassword(adminPassword);
    await db.insert(schema.users).values({
      id: adminId,
      name: "Administrator",
      email: adminEmail,
      passwordHash,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const initialCategories = [
    {
      id: "cat-ui-design",
      slug: "ui-design",
      nameId: "Desain & UI",
      nameEn: "Design & UI",
      descriptionId: "Skill dan panduan desain antarmuka modern yang tenang, presisi, dan anti-slop.",
      descriptionEn: "Skills and guidelines for calm, precise, and anti-slop modern interface design.",
      type: "all",
    },
    {
      id: "cat-code-automation",
      slug: "code-automation",
      nameId: "Otomasi Koding",
      nameEn: "Coding Automation",
      descriptionId: "Protokol dan skill untuk agent koding otomatis, git, dan pengujian software.",
      descriptionEn: "Protocols and skills for automated coding agents, git workflows, and software testing.",
      type: "all",
    },
    {
      id: "cat-architecture",
      slug: "architecture",
      nameId: "Arsitektur Sistem",
      nameEn: "System Architecture",
      descriptionId: "Pola arsitektur full-stack, database serverless, dan hardening keamanan API.",
      descriptionEn: "Full-stack architectural patterns, serverless databases, and API security hardening.",
      type: "all",
    },
  ];

  for (const cat of initialCategories) {
    const existing = await db.select().from(schema.categories).where(eq(schema.categories.slug, cat.slug));
    if (existing.length === 0) {
      await db.insert(schema.categories).values(cat);
    }
  }

  const initialSettings = [
    {
      id: "setting-features",
      key: "feature_flags",
      value: {
        teardowns: false,
        patterns: false,
        guides: false,
        glossary: false,
        tools: false,
        inspirations: false,
      },
    },
    {
      id: "setting-general",
      key: "general",
      value: {
        siteName: "ProSkillAI",
        taglineId: "Katalog Terbuka Skill Agent & Kumpulan Prompt AI",
        taglineEn: "Open Catalogue of AI Agent Skills & Prompt Library",
      },
    },
  ];

  for (const setting of initialSettings) {
    const existing = await db.select().from(schema.settings).where(eq(schema.settings.key, setting.key));
    if (existing.length === 0) {
      await db.insert(schema.settings).values(setting);
    }
  }

  const initialSkills = [
    {
      id: "skill-ui-modern",
      slug: "ui-modern",
      titleId: "UI Modern & Desain Anti-Slop (MONOLIT)",
      titleEn: "Modern UI & Anti-Slop Design Standard (MONOLIT)",
      summaryId: "Standar rekayasa UI/UX monokrom, aksesibilitas WCAG 2.2 AA, dan SEO teknis untuk agent AI koding.",
      summaryEn: "Monochrome UI/UX engineering standard, WCAG 2.2 AA accessibility, and technical SEO for AI coding agents.",
      contentId: `# MONOLIT — Anti-Slop UI Engineering

Standar baku rekayasa antarmuka pengguna untuk web publik. Menghilangkan klise desain generik AI, estetika terminal palsu, gradien berlebih, dan teks Lorem Ipsum.

## Prinsip Inti
1. Kepercayaan yang tenang (quiet confidence), bukan kekosongan visual.
2. Palet monokrom bersih dengan skala abu-abu netral teruji kontrasnya.
3. Satu keluarga font sans-serif berkualitas tinggi untuk seluruh teks antarmuka.
4. Aksesibilitas WCAG 2.2 AA sebagai fondasi, bukan aksesoris tambahan.
5. Animasi bermakna yang hanya memanfaatkan transform dan opacity.`,
      contentEn: `# MONOLIT — Anti-Slop UI Engineering

Strict public interface engineering standard. Eliminates generic AI design clichés, fake terminal aesthetics, excessive gradients, and Lorem Ipsum copy.

## Core Principles
1. Quiet confidence, not visual emptiness.
2. Clean monochrome palette with contrast-tested neutral gray scale.
3. Single high-quality sans-serif font family for all interface typography.
4. WCAG 2.2 AA accessibility as baseline foundation, not an afterthought.
5. Purposeful motion animating only transform and opacity.`,
      sourceType: "original",
      authorName: "ProSkillAI Team",
      authorUrl: "https://proskillai.dev",
      attribution: "Karya orisinal ProSkillAI di bawah lisensi MIT.",
      categoryId: "cat-ui-design",
      tags: ["ui", "design-system", "accessibility", "anti-slop"],
      previewType: "tokens",
      designTokens: {
        colors: [
          { name: "Background", hex: "#ffffff", darkHex: "#09090b" },
          { name: "Foreground", hex: "#09090b", darkHex: "#f4f4f5" },
          { name: "Muted", hex: "#f4f4f5", darkHex: "#18181b" },
          { name: "Muted Foreground", hex: "#71717a", darkHex: "#a1a1aa" },
          { name: "Border", hex: "#e4e4e7", darkHex: "#27272a" },
        ],
        typography: [
          { label: "Interface Font", value: "Geist Sans, system-ui, sans-serif" },
          { label: "Code Font", value: "Geist Mono, monospace" },
        ],
        spacing: ["4px", "8px", "12px", "16px", "24px", "32px", "48px"],
        radius: ["4px", "6px", "8px"],
      },
      status: "published",
      createdBy: adminId,
    },
    {
      id: "skill-button-presisi",
      slug: "button-presisi",
      titleId: "Standar Tombol Presisi & Kontrol Form Kompak",
      titleEn: "Precision Button & Compact Form Control Standard",
      summaryId: "Spesifikasi desain tombol non-pill, tinggi 32-38px, radius halus 6-8px, dan mikro-interaksi klik aktif.",
      summaryEn: "Design specification for non-pill buttons, 32-38px height, subtle 6-8px radius, and tactile click micro-interactions.",
      contentId: `# Tombol Presisi & Kontrol Form Kompak

Standar komponen tombol modern untuk aplikasi dan marketplace. Melarang keras bentuk kapsul/pill bulat penuh yang kekanak-kanakan.

## Aturan Komponen
- Tinggi standar: 34px hingga 38px untuk interaksi desktop dan sentuh yang nyaman.
- Radius sudut: 6px hingga 8px (halus dan matang).
- Ukuran font: 12px hingga 13px medium/semibold.
- Active state: transformasi skala halus saat diklik (scale 0.98).`,
      contentEn: `# Precision Button & Compact Form Control Standard

Modern button component standard for enterprise and marketplace applications. Strictly prohibits childish full-capsule/pill shapes.

## Component Rules
- Standard height: 34px to 38px for comfortable desktop and touch interaction.
- Corner radius: 6px to 8px (refined and mature).
- Font size: 12px to 13px medium/semibold.
- Active state: subtle scale transformation upon click (scale 0.98).`,
      sourceType: "original",
      authorName: "ProSkillAI Team",
      authorUrl: "https://proskillai.dev",
      attribution: "Karya orisinal ProSkillAI di bawah lisensi MIT.",
      categoryId: "cat-ui-design",
      tags: ["buttons", "forms", "ui-components", "micro-interactions"],
      previewType: "html",
      previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body { margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fafafa; color: #09090b; }
.row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
.btn { height: 36px; padding: 0 14px; font-size: 13px; font-weight: 500; border-radius: 6px; border: 1px solid transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s ease; outline: none; }
.btn-primary { background: #09090b; color: #ffffff; border-color: #09090b; }
.btn-primary:hover { background: #27272a; }
.btn-secondary { background: #ffffff; color: #09090b; border-color: #e4e4e7; }
.btn-secondary:hover { background: #f4f4f5; }
.btn:active { transform: scale(0.98); }
</style></head><body>
<div class="row">
  <button class="btn btn-primary">Simpan Perubahan</button>
  <button class="btn btn-secondary">Batal</button>
  <button class="btn btn-secondary" disabled style="opacity: 0.5; cursor: not-allowed;">Nonaktif</button>
</div>
</body></html>`,
      status: "published",
      createdBy: adminId,
    },
    {
      id: "skill-nokomen",
      slug: "nokomen",
      titleId: "Standar Kode Bersih Strict Tanpa Komentar (Nokomen)",
      titleEn: "Strict Zero-Comment Clean Code Standard (Nokomen)",
      summaryId: "Pedoman penulisan kode mandiri (self-documenting), struktur bersih, tanpa komentar basa-basi AI.",
      summaryEn: "Guidelines for self-documenting code, clean architectural structure, and zero AI boilerplate comments.",
      contentId: `# Standar Nokomen (Anti Komentar Kode)

Menegakkan kualitas kode bersih, penamaan variabel dan fungsi yang berbicara sendiri, serta struktur modular tanpa komentar hiasan.

## Ketentuan
- 0 komentar dalam file kode aplikasi.
- Nama fungsi mendeskripsikan tindakan secara utuh.
- Validasi tipe TypeScript yang ketat menggantikan komentar parameter.
- Gunakan pesan commit git dan dokumentasi markdown untuk narasi arsitektur.`,
      contentEn: `# Nokomen Standard (Zero-Comment Clean Code)

Enforces clean code quality, expressive naming for variables and functions, and modular architecture with zero decorative comments.

## Rules
- Zero comments inside application code files.
- Function names clearly declare their complete action.
- Strict TypeScript types replace parameter documentation comments.
- Use git commit messages and markdown documentation for architectural narrative.`,
      sourceType: "original",
      authorName: "ProSkillAI Team",
      authorUrl: "https://proskillai.dev",
      attribution: "Karya orisinal ProSkillAI di bawah lisensi MIT.",
      categoryId: "cat-code-automation",
      tags: ["clean-code", "refactoring", "best-practices", "typescript"],
      previewType: "none",
      status: "published",
      createdBy: adminId,
    },
  ];

  for (const sk of initialSkills) {
    const existing = await db.select().from(schema.skills).where(eq(schema.skills.slug, sk.slug));
    if (existing.length === 0) {
      await db.insert(schema.skills).values(sk);
    }
  }

  const initialPrompts = [
    {
      id: "prompt-feature-planner",
      slug: "fullstack-feature-planner",
      titleId: "Perencana Fitur Full-Stack & Hardening Keamanan",
      titleEn: "Full-Stack Feature Architecture & Security Planner",
      descriptionId: "Prompt terstruktur untuk merancang fitur end-to-end dengan skema data, otorisasi, dan validasi Zod.",
      descriptionEn: "Structured prompt for designing end-to-end features with database schema, authorization, and Zod validation.",
      contentId: `Kamu adalah Senior Full-Stack Architect. Rancang spesifikasi implementasi fitur {{feature_name}} untuk stack {{framework}} dengan database {{target_database}}.

Berikan output dalam 4 bagian:
1. Skema Database Drizzle & Indeks Relasional
2. Kontrak Server Action & Skema Validasi Zod
3. Aturan Otorisasi RBAC dan Proteksi CSRF
4. Checklist Pengujian Edge-Case dan State Aksesibilitas`,
      contentEn: `You are a Senior Full-Stack Architect. Design an end-to-end feature specification for {{feature_name}} using {{framework}} with {{target_database}}.

Provide the output in 4 structured sections:
1. Drizzle Database Schema & Relational Indexes
2. Server Action Contracts & Zod Validation Schemas
3. RBAC Authorization Rules and CSRF Protection
4. Edge-Case Verification Checklist and Accessibility States`,
      variables: [
        {
          name: "feature_name",
          labelId: "Nama Fitur",
          labelEn: "Feature Name",
          defaultValue: "GitHub Skill Importer",
          placeholder: "e.g., GitHub Skill Importer",
        },
        {
          name: "framework",
          labelId: "Framework",
          labelEn: "Framework",
          defaultValue: "Next.js App Router (Server Actions)",
          placeholder: "e.g., Next.js App Router",
        },
        {
          name: "target_database",
          labelId: "Database Target",
          labelEn: "Target Database",
          defaultValue: "Neon Serverless PostgreSQL (Drizzle ORM)",
          placeholder: "e.g., Neon Postgres",
        },
      ],
      categoryId: "cat-architecture",
      tags: ["architecture", "security", "full-stack", "planning"],
      status: "published",
      createdBy: adminId,
    },
    {
      id: "prompt-anti-slop-ui",
      slug: "anti-slop-ui-refactor",
      titleId: "Refactoring UI Anti-Slop & Pembersihan Desain AI",
      titleEn: "Anti-Slop UI Refactor & AI Design Cleanup",
      descriptionId: "Prompt untuk mengubah landing page atau komponen AI generik menjadi tampilan monokrom yang tenang dan elegan.",
      descriptionEn: "Prompt to transform generic AI landing pages or components into calm, elegant monochrome UI.",
      contentId: `Sebagai Principal Product Designer, audit dan refactor komponen {{component_name}} agar sesuai standar estetika {{brand_aesthetic}}.

Tuntutan eliminasi:
1. Hapus semua gradien, glassmorphism, blur dekoratif, dan orb berwarna.
2. Ganti semua badge status tidak penting dan statistik hero palsu dengan konten riil.
3. Terapkan hierarki tipografi tegas menggunakan Geist Sans dan skala radius konsisten 6px.
4. Pastikan kepatuhan kontras WCAG 2.2 AA pada tema terang dan gelap.`,
      contentEn: `As a Principal Product Designer, audit and refactor the {{component_name}} component to adhere to {{brand_aesthetic}} aesthetics.

Elimination requirements:
1. Remove all gradients, glassmorphism, decorative blurs, and colored glowing orbs.
2. Eliminate redundant status badges and fabricated hero stats in favor of genuine content.
3. Enforce clear typography hierarchy using Geist Sans and a coherent 6px radius scale.
4. Guarantee WCAG 2.2 AA contrast compliance across both light and dark themes.`,
      variables: [
        {
          name: "component_name",
          labelId: "Nama Komponen / Halaman",
          labelEn: "Component / Page Name",
          defaultValue: "Catalogue Card Grid",
          placeholder: "e.g., Hero Section",
        },
        {
          name: "brand_aesthetic",
          labelId: "Estetika Target",
          labelEn: "Target Aesthetic",
          defaultValue: "Monochrome Modern Editorial (Quiet Confidence)",
          placeholder: "e.g., Monochrome Modern Editorial",
        },
      ],
      categoryId: "cat-ui-design",
      tags: ["ui", "refactoring", "anti-slop", "design-system"],
      status: "published",
      createdBy: adminId,
    },
  ];

  for (const pr of initialPrompts) {
    const existing = await db.select().from(schema.prompts).where(eq(schema.prompts.slug, pr.slug));
    if (existing.length === 0) {
      await db.insert(schema.prompts).values(pr);
    }
  }

  console.log("Database seeded successfully.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
