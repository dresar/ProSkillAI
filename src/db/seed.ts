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
      id: "cat-ux-design",
      slug: "ux-design",
      nameId: "Desain UX",
      nameEn: "UX Design",
      descriptionId: "Arsitektur informasi, alur kerja frontend, dan panduan pengalaman pengguna.",
      descriptionEn: "Information architecture, frontend workflows, and user experience guidance.",
      type: "all",
    },
    {
      id: "cat-design-systems",
      slug: "design-systems",
      nameId: "Sistem Desain",
      nameEn: "Design Systems",
      descriptionId: "Fondasi token desain, tema variabel CSS, dan pustaka komponen scalable.",
      descriptionEn: "Design token foundations, CSS variable theming, and scalable component libraries.",
      type: "all",
    },
    {
      id: "cat-visual-design",
      slug: "visual-design",
      nameId: "Desain Visual",
      nameEn: "Visual Design",
      descriptionId: "Hierarki tipografi, prinsip gerak animasi, dan arahan visual antarmuka.",
      descriptionEn: "Typography hierarchy, motion principles, and interface visual direction.",
      type: "all",
    },
    {
      id: "cat-accessibility",
      slug: "accessibility",
      nameId: "Aksesibilitas",
      nameEn: "Accessibility",
      descriptionId: "Kepatuhan WCAG 2.2 AA, kontras warna, pembaca layar, dan navigasi keyboard.",
      descriptionEn: "WCAG 2.2 AA compliance, color contrast, screen readers, and keyboard navigation.",
      type: "all",
    },
    {
      id: "cat-product",
      slug: "product",
      nameId: "Riset Produk",
      nameEn: "Product & Research",
      descriptionId: "Metodologi wawancara pengguna, validasi kebutuhan pasar, dan sintesis riset.",
      descriptionEn: "User interview methods, market need validation, and research synthesis.",
      type: "all",
    },
    {
      id: "cat-content",
      slug: "content",
      nameId: "Konten & Tulisan",
      nameEn: "Content & Copy",
      descriptionId: "UX writing, komunikasi internal produk, dan penulisan antarmuka yang jernih.",
      descriptionEn: "UX writing, internal product comms, and crisp interface copy.",
      type: "all",
    },
    {
      id: "cat-marketing",
      slug: "marketing",
      nameId: "Pemasaran & Pertumbuhan",
      nameEn: "Marketing & Growth",
      descriptionId: "Penyuntingan copy promosi, reposisi produk, dan strategi konversi.",
      descriptionEn: "Marketing copy editing, product repositioning, and conversion strategies.",
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
      id: "skill-frontend-design",
      slug: "frontend-design",
      titleId: "Desain Frontend Produksi",
      titleEn: "Frontend Design",
      summaryId: "Membangun antarmuka frontend tingkat produksi yang distingtif dengan kualitas visual dan kode tinggi.",
      summaryEn: "Create distinctive, production-grade frontend interfaces with high design quality and clean architecture.",
      contentId: `# Frontend Design Standard
Pedoman membuat antarmuka frontend tingkat produksi yang distingtif. Menghindari template generik, menerapkan hierarki visual yang jelas, dan merancang state interaktif yang halus.`,
      contentEn: `# Frontend Design Standard
Guidelines to create distinctive, production-grade frontend interfaces. Avoid generic templates, enforce crisp visual hierarchies, and engineer tactile interaction states.`,
      sourceType: "github",
      repoUrl: "https://github.com/anthropics/anthropic-quickstarts",
      authorName: "Anthropic",
      authorUrl: "https://github.com/anthropics",
      attribution: "Anthropic Quickstarts repository under MIT license.",
      categoryId: "cat-ux-design",
      tags: ["frontend", "ux", "ui", "react"],
      previewType: "tokens",
      designTokens: {
        colors: [
          { name: "Background", hex: "#0c0c0e", darkHex: "#0c0c0e" },
          { name: "Surface", hex: "#141418", darkHex: "#141418" },
          { name: "Accent", hex: "#38bdf8", darkHex: "#38bdf8" },
        ],
      },
      status: "published",
      copyCount: 45500,
      createdBy: adminId,
    },
    {
      id: "skill-tailwind-design-system",
      slug: "tailwind-design-system",
      titleId: "Sistem Desain Tailwind v4",
      titleEn: "Tailwind Design System",
      summaryId: "Membangun sistem desain scalable dengan token CSS-first, tema OKLCH, dan komponen semantik.",
      summaryEn: "Build scalable design systems with Tailwind CSS v4: CSS-first tokens, OKLCH theming, and semantic primitives.",
      contentId: `# Tailwind Design System
Membangun sistem desain scalable dengan Tailwind CSS v4. Menggunakan variabel CSS murni, token semantik, dan skema warna adaptif.`,
      contentEn: `# Tailwind Design System
Build scalable design systems with Tailwind CSS v4 using pure CSS variables, semantic design tokens, and adaptive color schemes.`,
      sourceType: "github",
      repoUrl: "https://github.com/wshobson/design-tokens",
      authorName: "wshobson",
      authorUrl: "https://github.com/wshobson",
      attribution: "Open source community contribution under MIT license.",
      categoryId: "cat-design-systems",
      tags: ["tailwind", "css", "tokens", "design-system"],
      previewType: "tokens",
      designTokens: {
        colors: [
          { name: "Cyan", hex: "#22d3ee", darkHex: "#22d3ee" },
          { name: "Sky", hex: "#38bdf8", darkHex: "#38bdf8" },
        ],
      },
      status: "published",
      copyCount: 35700,
      createdBy: adminId,
    },
    {
      id: "skill-figma-use",
      slug: "figma-use",
      titleId: "Integrasi Skrip Figma MCP",
      titleEn: "Figma Use",
      summaryId: "Prasyarat wajib untuk Figma MCP: menjalankan skrip Plugin API untuk membuat, mengedit, dan menganalisis layout.",
      summaryEn: "Mandatory prerequisite for Figma MCP: execute Plugin API scripts to create, edit, and inspect designs directly.",
      contentId: `# Figma Use
Menjalankan skrip integrasi Figma MCP untuk ekstraksi token dan inspeksi frame desain secara terprogram.`,
      contentEn: `# Figma Use
Execute Figma MCP scripts for programmatic design token extraction and automated component inspection.`,
      sourceType: "github",
      repoUrl: "https://github.com/figma/plugin-samples",
      authorName: "Figma",
      authorUrl: "https://figma.com",
      attribution: "Official Figma Developer Resources under Apache 2.0.",
      categoryId: "cat-ux-design",
      tags: ["figma", "mcp", "plugins", "design"],
      previewType: "tokens",
      status: "published",
      copyCount: 3300,
      createdBy: adminId,
    },
    {
      id: "skill-design-motion-principles",
      slug: "design-motion-principles",
      titleId: "Prinsip Gerak & Animasi Antarmuka",
      titleEn: "Design Motion Principles",
      summaryId: "Desain gerak dan mikro-interaksi bermakna dengan kurva easing natural dan penghormatan prefers-reduced-motion.",
      summaryEn: "Motion and interaction design through purposeful transform and opacity transitions with reduced-motion support.",
      contentId: `# Design Motion Principles
Standar desain gerak antarmuka. Hanya menggerakkan transform dan opacity, menghindari reflow berat, dan mematuhi prefers-reduced-motion.`,
      contentEn: `# Design Motion Principles
Interface motion design principles. Only animate transform and opacity, avoid heavy reflows, and respect prefers-reduced-motion.`,
      sourceType: "github",
      repoUrl: "https://github.com/kylezantos/motion-specs",
      authorName: "kylezantos",
      authorUrl: "https://github.com/kylezantos",
      attribution: "Kyle Zantos motion guide under MIT license.",
      categoryId: "cat-visual-design",
      tags: ["animation", "motion", "micro-interactions"],
      previewType: "tokens",
      status: "published",
      copyCount: 2900,
      createdBy: adminId,
    },
    {
      id: "skill-wcag-accessibility",
      slug: "wcag-accessibility",
      titleId: "Standar Aksesibilitas WCAG 2.2",
      titleEn: "WCAG Accessibility",
      summaryId: "Audit dan tingkatkan aksesibilitas web sesuai prinsip POUR WCAG 2.2, rasio kontras 4.5:1, dan fokus terlihat.",
      summaryEn: "Audit and improve web accessibility with WCAG 2.2 POUR principles, 4.5:1 contrast tables, and visible focus rings.",
      contentId: `# WCAG Accessibility
Panduan audit dan implementasi WCAG 2.2 AA. Memastikan keyboard navigasi penuh, peran ARIA semantik, dan teks alternatif gambar informatif.`,
      contentEn: `# WCAG Accessibility
WCAG 2.2 AA implementation and audit guide. Guarantee full keyboard navigability, semantic ARIA roles, and informative alt text.`,
      sourceType: "github",
      repoUrl: "https://github.com/addyosmani/a11y-patterns",
      authorName: "addyosmani",
      authorUrl: "https://github.com/addyosmani",
      attribution: "Addy Osmani accessibility patterns under MIT license.",
      categoryId: "cat-accessibility",
      tags: ["accessibility", "wcag", "a11y", "contrast"],
      previewType: "tokens",
      status: "published",
      copyCount: 2100,
      createdBy: adminId,
    },
    {
      id: "skill-user-research",
      slug: "user-research",
      titleId: "Sintesis Riset Pengguna",
      titleEn: "User Research",
      summaryId: "Rencanakan, lakukan, dan sintesis riset pengguna: pemilihan metode, panduan wawancara, dan affinity mapping.",
      summaryEn: "Plan, conduct, and synthesize user research: method selection, interview guide structure, and affinity mapping.",
      contentId: `# User Research
Metodologi riset kualitatif dan kuantitatif untuk tim produk. Mengumpulkan umpan balik otentik dan merumuskan wawasan teknis.`,
      contentEn: `# User Research
Qualitative and quantitative research methodology for engineering teams. Gather authentic feedback and structure technical insights.`,
      sourceType: "github",
      repoUrl: "https://github.com/anthropics/anthropic-quickstarts",
      authorName: "Anthropic",
      authorUrl: "https://github.com/anthropics",
      attribution: "Anthropic Quickstarts repository under MIT license.",
      categoryId: "cat-product",
      tags: ["research", "product", "interviews", "strategy"],
      previewType: "tokens",
      status: "published",
      copyCount: 1900,
      createdBy: adminId,
    },
    {
      id: "skill-internal-communications",
      slug: "internal-communications",
      titleId: "Komunikasi Internal & Penulisan Dokumen",
      titleEn: "Internal Communications",
      summaryId: "Tulis komunikasi internal profesional: pembaruan 3P, buletin rekayasa, FAQ, dan memo status proyek.",
      summaryEn: "Write professional internal communications: 3P updates, engineering newsletters, FAQs, and project status memos.",
      contentId: `# Internal Communications
Standar penulisan dokumen dan komunikasi teknis internal tim rekayasa. Bebas jargon hampa dan langsung pada substansi.`,
      contentEn: `# Internal Communications
Internal technical communication and documentation standards for engineering organizations. Crisp, factual, and direct.`,
      sourceType: "github",
      repoUrl: "https://github.com/anthropics/anthropic-quickstarts",
      authorName: "Anthropic",
      authorUrl: "https://github.com/anthropics",
      attribution: "Anthropic Quickstarts repository under MIT license.",
      categoryId: "cat-content",
      tags: ["comms", "content", "documentation", "writing"],
      previewType: "tokens",
      status: "published",
      copyCount: 45500,
      createdBy: adminId,
    },
    {
      id: "skill-ppt-visual",
      slug: "ppt-visual",
      titleId: "Visual Presentasi & Slide Layout",
      titleEn: "PPT Visual",
      summaryId: "Rancang slide presentasi profesional dengan palet warna bersih, spesifikasi tipografi, dan hierarki visual tegas.",
      summaryEn: "Design professional PowerPoint slide layouts with clean color palettes, typography specs, and clear visual hierarchy.",
      contentId: `# PPT Visual
Panduan menyusun slide teknis arsitektur dan presentasi dewan direksi tanpa visual klise yang membingungkan.`,
      contentEn: `# PPT Visual
Guide to designing technical architecture slides and executive decks without cluttered or distracting visuals.`,
      sourceType: "github",
      repoUrl: "https://github.com/claude-office-skills/ppt",
      authorName: "claude-office-skills",
      authorUrl: "https://github.com/claude-office-skills",
      attribution: "Claude Office Skills community under Apache 2.0.",
      categoryId: "cat-visual-design",
      tags: ["presentation", "slides", "visual", "layout"],
      previewType: "tokens",
      status: "published",
      copyCount: 5600,
      createdBy: adminId,
    },
    {
      id: "skill-copy-editing",
      slug: "copy-editing",
      titleId: "Penyuntingan Copy & Teks Pemasaran",
      titleEn: "Copy Editing",
      summaryId: "Sunting dan poles teks produk dengan 7 tahap terfokus: kejernihan, suara merek, bukti nyata, dan ritme kalimat.",
      summaryEn: "Edit and polish marketing copy with seven focused passes: clarity, brand voice, factual proof, and authentic cadence.",
      contentId: `# Copy Editing
Protokol penyuntingan teks dan copywriting tingkat lanjut. Mengeliminasi kata-kata hiasan generik AI dan menonjolkan nilai nyata.`,
      contentEn: `# Copy Editing
Advanced copywriting and editing protocol. Eliminates generic AI padding and highlights concrete product value.`,
      sourceType: "github",
      repoUrl: "https://github.com/coreyhaines31/marketing-skills",
      authorName: "coreyhaines31",
      authorUrl: "https://github.com/coreyhaines31",
      attribution: "Corey Haines Marketing Skills under MIT license.",
      categoryId: "cat-marketing",
      tags: ["copywriting", "marketing", "editing", "clarity"],
      previewType: "tokens",
      status: "published",
      copyCount: 5100,
      createdBy: adminId,
    },
    {
      id: "skill-ui-modern",
      slug: "ui-modern",
      titleId: "UI Modern & Desain Anti-Slop (MONOLIT)",
      titleEn: "Modern UI & Anti-Slop Design Standard (MONOLIT)",
      summaryId: "Standar rekayasa UI/UX monokrom, aksesibilitas WCAG 2.2 AA, dan SEO teknis untuk agent AI koding.",
      summaryEn: "Monochrome UI/UX engineering standard, WCAG 2.2 AA accessibility, and technical SEO for AI coding agents.",
      contentId: `# MONOLIT — Anti-Slop UI Engineering
Standar baku rekayasa antarmuka pengguna untuk web publik. Menghilangkan klise desain generik AI, estetika terminal palsu, gradien berlebih, dan teks Lorem Ipsum.`,
      contentEn: `# MONOLIT — Anti-Slop UI Engineering
Strict public interface engineering standard. Eliminates generic AI design clichés, fake terminal aesthetics, excessive gradients, and Lorem Ipsum copy.`,
      sourceType: "original",
      authorName: "ProSkillAI Team",
      authorUrl: "https://proskillai.dev",
      attribution: "Karya orisinal ProSkillAI di bawah lisensi MIT.",
      categoryId: "cat-design-systems",
      tags: ["ui", "design-system", "accessibility", "anti-slop"],
      previewType: "tokens",
      designTokens: {
        colors: [
          { name: "Background", hex: "#ffffff", darkHex: "#09090b" },
          { name: "Foreground", hex: "#09090b", darkHex: "#f4f4f5" },
          { name: "Border", hex: "#e4e4e7", darkHex: "#27272a" },
        ],
      },
      status: "published",
      copyCount: 18400,
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
Standar komponen tombol modern untuk aplikasi dan marketplace. Melarang keras bentuk kapsul/pill bulat penuh yang kekanak-kanakan.`,
      contentEn: `# Precision Button & Compact Form Control Standard
Modern button component standard for enterprise and marketplace applications. Strictly prohibits childish full-capsule/pill shapes.`,
      sourceType: "original",
      authorName: "ProSkillAI Team",
      authorUrl: "https://proskillai.dev",
      attribution: "Karya orisinal ProSkillAI di bawah lisensi MIT.",
      categoryId: "cat-design-systems",
      tags: ["button", "forms", "ui-component", "precision"],
      previewType: "tokens",
      status: "published",
      copyCount: 14200,
      createdBy: adminId,
    },
    {
      id: "skill-nokomen",
      slug: "nokomen",
      titleId: "Standar Kode Bersih Anti-Komentar (Nokomen)",
      titleEn: "Strict Zero-Comment Clean Code Standard (Nokomen)",
      summaryId: "Aturan ketat penulisan kode mandiri tanpa komentar redundant, bloat, atau anotasi generik AI.",
      summaryEn: "Strict rulebook for self-documenting code without redundant comments, code bloat, or AI commentary.",
      contentId: `# Strict Zero-Comment Standard (Nokomen)
Menghilangkan seluruh komentar di kode sumber. Menuntut penamaan simbol deskriptif, fungsi kecil berfokus, dan struktur modular.`,
      contentEn: `# Strict Zero-Comment Standard (Nokomen)
Eliminates all commentary in source code. Enforces descriptive symbol naming, small focused functions, and modular architecture.`,
      sourceType: "original",
      authorName: "ProSkillAI Team",
      authorUrl: "https://proskillai.dev",
      attribution: "Karya orisinal ProSkillAI di bawah lisensi MIT.",
      categoryId: "cat-code-automation",
      tags: ["clean-code", "refactoring", "no-comments", "architecture"],
      previewType: "tokens",
      status: "published",
      copyCount: 12600,
      createdBy: adminId,
    },
  ];

  for (const sk of initialSkills) {
    const existing = await db.select().from(schema.skills).where(eq(schema.skills.slug, sk.slug));
    if (existing.length === 0) {
      await db.insert(schema.skills).values(sk);
    } else {
      await db.update(schema.skills).set(sk).where(eq(schema.skills.slug, sk.slug));
    }
  }

  const initialPrompts = [
    {
      id: "prompt-nextjs-arch",
      slug: "nextjs-fullstack-architecture",
      titleId: "Arsitektur Full-Stack Next.js Produksi",
      titleEn: "Production Next.js Architecture Prompt",
      descriptionId: "Prompt teruji untuk merancang arsitektur web Next.js App Router serverless dengan Drizzle ORM dan otentikasi.",
      descriptionEn: "Battle-tested prompt to scaffold Next.js App Router serverless architecture with Drizzle ORM and RBAC auth.",
      contentId: `Kamu adalah Senior Full-Stack Architect. Rancang arsitektur aplikasi Next.js App Router bernama {{app_name}}.
Spesifikasi teknis:
- Framework: Next.js 16 (App Router, Server Actions, Zero-Leak Security).
- Database: Neon Serverless PostgreSQL dengan Drizzle ORM.
- Aksesibilitas: WCAG 2.2 AA.`,
      contentEn: `You are a Senior Full-Stack Architect. Design a production Next.js App Router architecture named {{app_name}}.
Technical requirements:
- Framework: Next.js 16 (App Router, Server Actions, Zero-Leak Security).
- Database: Neon Serverless PostgreSQL with Drizzle ORM.
- Accessibility: WCAG 2.2 AA.`,
      variables: [
        {
          name: "app_name",
          labelId: "Nama Aplikasi",
          labelEn: "Application Name",
          defaultValue: "CloudVault Platform",
          placeholder: "e.g., CloudVault Platform",
        },
      ],
      categoryId: "cat-architecture",
      tags: ["architecture", "nextjs", "drizzle", "full-stack"],
      status: "published",
      copyCount: 4200,
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
3. Terapkan hierarki tipografi tegas menggunakan Geist Sans.`,
      contentEn: `As a Principal Product Designer, audit and refactor the {{component_name}} component to adhere to {{brand_aesthetic}} aesthetics.
Elimination requirements:
1. Remove all gradients, glassmorphism, decorative blurs, and colored glowing orbs.
2. Eliminate redundant status badges and fabricated hero stats in favor of genuine content.
3. Enforce clear typography hierarchy using Geist Sans.`,
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
      categoryId: "cat-ux-design",
      tags: ["ui", "refactoring", "anti-slop", "design-system"],
      status: "published",
      copyCount: 4900,
      createdBy: adminId,
    },
    {
      id: "prompt-wcag-audit",
      slug: "wcag-audit-checklist",
      titleId: "Audit Aksesibilitas WCAG 2.2 AA",
      titleEn: "WCAG 2.2 AA Accessibility Audit Prompt",
      descriptionId: "Prompt terstruktur untuk memindai kepatuhan rasio kontras warna, keyboard focus trap, dan navigasi screen reader.",
      descriptionEn: "Structured prompt to scan color contrast ratios, keyboard focus traps, and screen reader announcements.",
      contentId: `Audit komponen {{target_url}} terhadap kepatuhan WCAG 2.2 level AA.
Periksa secara ketat:
1. Rasio kontras teks normal minimal 4.5:1 terhadap latar belakang.
2. Indikator fokus keyboard tampak jelas pada outline-2.
3. Struktur heading teratur dari h1 ke h6 tanpa melompat level.`,
      contentEn: `Audit the component {{target_url}} against WCAG 2.2 AA accessibility criteria.
Strictly verify:
1. Normal text contrast ratio at least 4.5:1 against background.
2. Visible keyboard focus indicator on outline-2.
3. Logical heading hierarchy from h1 to h6 without skipping levels.`,
      variables: [
        {
          name: "target_url",
          labelId: "Komponen / URL Sasaran",
          labelEn: "Target Component / URL",
          defaultValue: "Homepage & Navigation Header",
          placeholder: "e.g., Checkout Form Modal",
        },
      ],
      categoryId: "cat-accessibility",
      tags: ["accessibility", "audit", "wcag", "a11y"],
      status: "published",
      copyCount: 2700,
      createdBy: adminId,
    },
    {
      id: "prompt-ux-copywriting",
      slug: "ux-copywriting-engine",
      titleId: "Penulisan Mikro-Teks UX Konversi Tinggi",
      titleEn: "High-Conversion Product Microcopy Prompt",
      descriptionId: "Prompt untuk merancang teks tombol, empty state, tooltip, dan pesan validasi form yang jernih dan ramah.",
      descriptionEn: "Prompt to craft button labels, empty states, tooltips, and form validation messages with clarity and warmth.",
      contentId: `Susun mikro-teks UX untuk fitur {{feature_domain}} pada produk {{product_type}}.
Hindari istilah teknis membingungkan dan pastikan kalimat ringkas, instruktif, dan meyakinkan.`,
      contentEn: `Craft UX microcopy for the {{feature_domain}} feature on a {{product_type}} application.
Avoid confusing jargon and ensure copy is concise, instructive, and reassuring.`,
      variables: [
        {
          name: "feature_domain",
          labelId: "Area Fitur",
          labelEn: "Feature Area",
          defaultValue: "GitHub Skill Import Dialog",
          placeholder: "e.g., Two-Factor Authentication Setup",
        },
        {
          name: "product_type",
          labelId: "Tipe Produk",
          labelEn: "Product Type",
          defaultValue: "AI Developer Tooling & Catalog",
          placeholder: "e.g., Enterprise SaaS Platform",
        },
      ],
      categoryId: "cat-content",
      tags: ["copywriting", "ux", "microcopy", "content"],
      status: "published",
      copyCount: 3100,
      createdBy: adminId,
    },
  ];

  for (const pr of initialPrompts) {
    const existing = await db.select().from(schema.prompts).where(eq(schema.prompts.slug, pr.slug));
    if (existing.length === 0) {
      await db.insert(schema.prompts).values(pr);
    } else {
      await db.update(schema.prompts).set(pr).where(eq(schema.prompts.slug, pr.slug));
    }
  }

  console.log("Database seeded successfully.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
