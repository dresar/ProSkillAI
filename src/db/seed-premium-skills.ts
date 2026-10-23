import { randomBytes } from "node:crypto";
import * as dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

dotenv.config();

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";
if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

const premiumSkills = [
  {
    id: "skl_taste_skill",
    slug: "taste-skill",
    titleId: "Taste Skill - Art Direction Frontend Anti-Slop",
    titleEn: "Taste Skill - Anti-Slop Frontend Art Direction",
    summaryId: "Menghilangkan template generik AI dengan 20 arah desain terkurasi dari 247 situs web riil, palet terarah, dan inspeksi browser langsung.",
    summaryEn: "Replaces generic AI page defaults with 20 curated design directions distilled from 247 real award-winning sites and real-browser inspection.",
    contentId: `# Taste Skill v2 (Frontend Art Direction)

Skill anti-slop untuk frontend engineer dan AI agent. Menghilangkan template generik buatan model (tiga baris headline rata tengah, icon cards berulang, gradien tipis) dan menggantikannya dengan keputusan desain berbasis referensi nyata.

## 4 Pilar Utama
1. **Arah Desain Terkurasi**: Memilih 3 dari 20 arah visual hasil studi 247 situs Awwwards & One Page Love.
2. **Konsep Berakar dari Subjek**: Menghubungkan identitas asli produk dengan elemen visual spesifik.
3. **House Style Tanpa Ornamen Palsu**: Bebas dari border tipis, bayangan berlebihan, atau label badge yang tidak bermakna.
4. **Verifikasi Browser Nyata**: Menggunakan script \`inspect.mjs\` untuk mengecek rendering di resolusi 1440px, 768px, dan 390px.

## Instalasi CLI
\`\`\`bash
npx skills add Leonxlnx/taste-skill@design-taste-frontend
\`\`\`

## Aturan Desain Inti
- Headline maksimal 2 baris pada semua resolusi layar.
- Margin luar seimbang dan ritme spasi 120-240px antar bagian desktop.
- Mengutamakan fotografi atau aset asli dibanding gambar placeholder kosong.
- Tipografi kontras tinggi (maksimal 2 font family pada 1 halaman).`,
    contentEn: `# Taste Skill v2 (Frontend Art Direction)

The premier anti-slop frontend art direction skill for AI coding agents. Replaces generic defaults with intentional design decisions extracted from 247 award-winning websites.

## Core Pillars
1. **Curated Art Direction**: Selects 3 of 20 research-backed visual directions instead of generic stock cards.
2. **Subject-Derived Identity**: Grounds visual metaphors in the product's actual materials and purpose.
3. **Zero-Slop House Style**: Eliminates hairline grid dividers, pill badges, and artificial glassmorphism.
4. **Real-Browser Inspection**: Validates layouts at 1440px, 768px, and 390px viewports with zero lint failures.

## Installation
\`\`\`bash
npx skills add Leonxlnx/taste-skill@design-taste-frontend
\`\`\`

## Craft Rules
- Headlines never exceed 2 lines across all viewports.
- Equal outer margins with 120-240px desktop section rhythms.
- Real photography and authentic interface crops prioritized over abstract icons.
- Strict typography scale with maximum 2 font families per page.`,
    frontmatter: {
      name: "design-taste-frontend",
      version: "2.0.0",
      license: "MIT",
      stars: 101442,
      author: "Leonxlnx",
    },
    sourceType: "github",
    repoUrl: "https://github.com/Leonxlnx/taste-skill",
    filePath: "skills/taste-skill/SKILL.md",
    branch: "main",
    commitHash: "433d921",
    license: "MIT",
    authorName: "Leonxlnx",
    authorUrl: "https://github.com/Leonxlnx",
    attribution: "Leonxlnx (Featured on AgenticSkills.io)",
    categoryId: "cat-visual-design",
    tags: ["design", "frontend", "anti-slop", "ui-ux", "art-direction"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 99130,
    downloadCount: 6740,
  },
  {
    id: "skl_superpowers",
    slug: "superpowers",
    titleId: "Superpowers - Framework Metodologi Rekayasa Software",
    titleEn: "Superpowers - Agentic Software Engineering Framework",
    summaryId: "Framework metodologi pengembangan software agentic dengan alur kerja brainstorming wajib, perancangan rencana, dan subagent development.",
    summaryEn: "Foundational software development methodology for coding agents enforcing brainstorming, plan execution, and subagent development.",
    contentId: `# Superpowers

Framework rekayasa perangkat lunak agentic yang terbukti untuk Claude Code, Cursor, Codex, dan Antigravity.

## Kumpulan Skill Termasuk
1. **Brainstorming**: Menyelidiki niat, arsitektur, dan tradeoff sebelum menulis kode produksi.
2. **Executing Plans**: Menjalankan rencana implementasi multi-tahap dengan pos pemeriksaan verifikasi mandiri.
3. **Subagent-Driven Development**: Mendelegasikan tugas independen ke subagent paralel untuk mencegah polusi konteks.
4. **Systematic Debugging**: Analisis akar masalah secara ilmiah melalui reproduksi bug sebelum perbaikan diterapkan.

## Cara Pemasangan
\`\`\`bash
claude plugin add obra/superpowers
\`\`\``,
    contentEn: `# Superpowers

An agentic skills framework and software engineering methodology that produces verified, reliable code.

## Included Skills
1. **Brainstorming**: Deep exploration of requirements, user intent, and architecture before code changes.
2. **Executing Plans**: Step-by-step execution checkpoints with verified assertions.
3. **Subagent-Driven Development**: Isolated parallel worker dispatching to protect reasoning context.
4. **Systematic Debugging**: Scientific hypothesis-driven root cause analysis before making code edits.

## Installation
\`\`\`bash
claude plugin add obra/superpowers
\`\`\``,
    frontmatter: {
      name: "superpowers",
      version: "1.0.0",
      license: "MIT",
      stars: 304040,
      author: "obra",
    },
    sourceType: "github",
    repoUrl: "https://github.com/obra/superpowers",
    filePath: "skills/brainstorming/SKILL.md",
    branch: "main",
    commitHash: "9a21b3c",
    license: "MIT",
    authorName: "Jesse Vincent (obra)",
    authorUrl: "https://github.com/obra",
    attribution: "Jesse Vincent (obra/superpowers)",
    categoryId: "cat-code-automation",
    tags: ["software-engineering", "architecture", "subagents", "workflow"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 304040,
    downloadCount: 27080,
  },
  {
    id: "skl_ecc_backend_patterns",
    slug: "ecc-backend-patterns",
    titleId: "ECC Backend Patterns - Arsitektur Node & Next.js Scalable",
    titleEn: "ECC Backend Patterns - Scalable Node & Next.js Architecture",
    summaryId: "Pola arsitektur backend, optimasi query database, sanitasi layer API, dan keamanan serverless untuk performa tinggi.",
    summaryEn: "High-performance backend architecture patterns, database query tuning, and serverless API route design.",
    contentId: `# Backend Development Patterns (ECC)

Sistem optimasi harness backend untuk arsitektur serverless, microservices, dan API route modern.

## Panduan Teknis
- **Layering Terisolasi**: Memisahkan route handler dari domain service dan database layer.
- **Connection Pooling**: Memanfaatkan pooled connection strings untuk komputasi serverless tanpa kehabisan socket TCP.
- **Validasi Schema Kuat**: Validasi input runtime berbasis Zod sebelum query dieksekusi.
- **Audit Logging Terstruktur**: Setiap mutasi penting mencatat audit log dengan ID unik dan timestamp ISO 8601.`,
    contentEn: `# Backend Development Patterns (ECC)

Agent optimization harness patterns for modern serverless, relational databases, and enterprise API design.

## Core Directives
- **Strict Layering**: Enforce clean separation between transport handlers, service logic, and database queries.
- **Serverless Pooling**: Manage connection socket exhaustion with pooled connection strings.
- **Runtime Validation**: Robust input parsing with strict type schemas before database execution.
- **Audit Trails**: Immutable JSON audit logs for state-altering transactions.`,
    frontmatter: {
      name: "backend-patterns",
      license: "MIT",
      stars: 287010,
      author: "affaan-m",
    },
    sourceType: "github",
    repoUrl: "https://github.com/affaan-m/ECC",
    filePath: ".agents/skills/backend-patterns/SKILL.md",
    branch: "main",
    commitHash: "1e4f90a",
    license: "MIT",
    authorName: "affaan-m",
    authorUrl: "https://github.com/affaan-m",
    attribution: "Everything Claude Code (affaan-m/ECC)",
    categoryId: "cat-code-automation",
    tags: ["backend", "database", "api-design", "node", "architecture"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 287010,
    downloadCount: 42570,
  },
  {
    id: "skl_anthropic_frontend_design",
    slug: "anthropic-frontend-design",
    titleId: "Anthropic Frontend Design - Standar Desain Visual Resmi",
    titleEn: "Anthropic Frontend Design - Official Visual Design Skill",
    summaryId: "Pedoman resmi dari Anthropic untuk menciptakan antarmuka visual yang distingtif, tipografi matang, dan bebas dari kebiasaan template AI.",
    summaryEn: "Official Anthropic guidance for distinctive visual interfaces, mature typography, and non-templated UI design.",
    contentId: `# Frontend Design (Anthropic)

Pedoman resmi Anthropic untuk merancang pengalaman antarmuka yang memiliki identitas kuat dan karakter khas.

## Prinsip Desain
- **Pilihan Tipografi Berani**: Memilih tipografi yang berbicara mewakili suara merek, bukan sekadar font sans-serif bawaan browser.
- **Ritme Spasi Proporsional**: Mengatur spasi modular berdasarkan kelipatan sistem 4px atau 8px.
- **Kontras Aksesibel**: Menjamin rasio kontras teks minimal 4.5:1 untuk teks normal dan 3:1 untuk teks berukuran besar sesuai pedoman WCAG AA.`,
    contentEn: `# Frontend Design (Anthropic)

Official Anthropic guidance for distinctive, intentional visual design when building new interfaces or refactoring existing UI.

## Design Directives
- **Intentional Typography**: Select type scales that reinforce brand personality rather than generic system fallbacks.
- **Modular Rhythm**: Coordinate space through cohesive 4px and 8px grid ratios.
- **Accessible Contrast**: Ensure 4.5:1 text-to-background contrast meeting WCAG 2.2 AA guidelines.`,
    frontmatter: {
      name: "frontend-design",
      license: "MIT",
      stars: 183199,
      author: "Anthropic",
    },
    sourceType: "github",
    repoUrl: "https://github.com/anthropics/skills",
    filePath: "skills/frontend-design/SKILL.md",
    branch: "main",
    commitHash: "88cc41a",
    license: "MIT",
    authorName: "Anthropic",
    authorUrl: "https://github.com/anthropics",
    attribution: "Official Anthropic Agent Skills",
    categoryId: "cat-visual-design",
    tags: ["design", "frontend", "anthropic", "official", "typography"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 183199,
    downloadCount: 21691,
  },
  {
    id: "skl_graphify",
    slug: "graphify",
    titleId: "Graphify - Navigasi Codebase Knowledge Graph AST",
    titleEn: "Graphify - Codebase Knowledge Graph AST Engine",
    summaryId: "Mengubah seluruh file proyek, skema SQL, dan konfigurasi menjadi graf relasi terhubung tanpa vector database untuk navigasi simbol cepat.",
    summaryEn: "Turns codebases, SQL schemas, and docs into deterministic queryable knowledge graphs using AST parsing without vector databases.",
    contentId: `# Graphify Codebase Engine

Navigasi arsitektur codebase kompleks menggunakan pemetaan AST (Abstract Syntax Tree) lokal dan deteksi komunitas Leiden.

## Keunggulan
- **100% Deterministik**: Menghubungkan definisi fungsi, import, schema, dan relasi tabel tanpa halusinasi embedding.
- **Zero Vector Store**: Berjalan langsung secara lokal tanpa dependensi API eksternal.
- **Dukungan Multi-Language**: TypeScript, JavaScript, Python, Go, Rust, dan SQL schemas.`,
    contentEn: `# Graphify Codebase Engine

Complex codebase navigation using local Abstract Syntax Tree (AST) parsing and Leiden community relationship graphs.

## Capabilities
- **Deterministic Traversal**: Maps function calls, modules, and schema foreign keys without vector search hallucination.
- **Local First**: Runs locally on your machine with zero remote database overhead.
- **Multi-Language**: Native support for TypeScript, Python, Go, Rust, and SQL schemas.`,
    frontmatter: {
      name: "graphify",
      license: "Apache-2.0",
      stars: 133613,
      author: "Graphify-Labs",
    },
    sourceType: "github",
    repoUrl: "https://github.com/Graphify-Labs/graphify",
    filePath: "AGENTS.md",
    branch: "v8",
    commitHash: "7b09c21",
    license: "Apache-2.0",
    authorName: "Graphify Labs",
    authorUrl: "https://github.com/Graphify-Labs",
    attribution: "Graphify Labs",
    categoryId: "cat-code-automation",
    tags: ["ast", "knowledge-graph", "code-analysis", "architecture"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 133613,
    downloadCount: 12767,
  },
  {
    id: "skl_caveman",
    slug: "caveman",
    titleId: "Caveman - Optimasi Efisiensi & Hemat Token Agen 65%",
    titleEn: "Caveman - 65% Token Optimization Agent Efficiency",
    summaryId: "Memangkas pemborosan token hingga 65% dengan instruksi reasoning padat dan langsung ke inti permasalahan tanpa basa-basi.",
    summaryEn: "Reduces token consumption by up to 65% through hyper-dense, high-impact reasoning directives.",
    contentId: `# Caveman Protocol

Optimasi token agresif untuk agen koding. Memangkas biaya inference API dan mempercepat respons dengan menghilangkan kalimat pengantar basa-basi.

## Prinsip Kerja
- Hapus kalimat pembuka ("Tentu saya akan membantu Anda...").
- Sajikan langsung diff kode dan solusi tanpa narasi panjang.
- Pertahankan akurasi sintaksis 100% pada file yang diedit.`,
    contentEn: `# Caveman Protocol

Aggressive token optimization for coding agents. Reduces token costs by up to 65% while keeping precision and speed high.

## Core Rules
- Strip boilerplate conversational filler.
- Deliver direct file edits and verification proofs immediately.
- Maintain 100% syntax precision across all code changes.`,
    frontmatter: {
      name: "caveman",
      license: "Apache-2.0",
      stars: 114543,
      author: "JuliusBrussee",
    },
    sourceType: "github",
    repoUrl: "https://github.com/JuliusBrussee/caveman",
    filePath: "AGENTS.md",
    branch: "main",
    commitHash: "5b12a88",
    license: "Apache-2.0",
    authorName: "Julius Brussee",
    authorUrl: "https://github.com/JuliusBrussee",
    attribution: "Julius Brussee (caveman)",
    categoryId: "cat-code-automation",
    tags: ["token-optimization", "performance", "efficiency", "llm"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 114543,
    downloadCount: 6600,
  },
  {
    id: "skl_skillopt",
    slug: "skillopt",
    titleId: "SkillOpt - Pelatihan & Optimasi Skill Mandiri AI Agent",
    titleEn: "SkillOpt - Self-Evolving Agent Skills Optimizer",
    summaryId: "Sistem dari Microsoft Research untuk melatih skill agen AI seperti neural network melalui epoch, batch size, dan validation gates.",
    summaryEn: "Microsoft Research optimizer that trains reusable natural language skills for LLM agents using validation-gated updates.",
    contentId: `# SkillOpt (Microsoft Research)

Melatih dan mengoptimasi skill agen secara otomatis melalui iterasi berbasis data tanpa harus melatih ulang bobot model bahasa.

## Karakteristik
- **Validation Gates**: Setiap pembaruan instruksi diuji terhadap rangkaian tes evaluasi ketat.
- **Artefak Portabel**: Menghasilkan artefak instruksi markdown yang dapat langsung dioperasikan pada runtime agen apa pun.`,
    contentEn: `# SkillOpt (Microsoft Research)

Automated optimization framework that trains natural-language agent skills like neural networks using validation-gated iteration.

## Key Properties
- **Validation Gates**: Every skill update is verified against automated evaluation suites.
- **Portable Artifacts**: Generates structured markdown skill files usable in any agent runtime.`,
    frontmatter: {
      name: "skillopt",
      license: "MIT",
      stars: 18647,
      author: "microsoft",
    },
    sourceType: "github",
    repoUrl: "https://github.com/microsoft/SkillOpt",
    filePath: "README.md",
    branch: "main",
    commitHash: "3f8819d",
    license: "MIT",
    authorName: "Microsoft Research",
    authorUrl: "https://github.com/microsoft",
    attribution: "Microsoft Research",
    categoryId: "cat-code-automation",
    tags: ["machine-learning", "agent-training", "optimization", "research"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 18647,
    downloadCount: 1766,
  },
  {
    id: "skl_claude_red",
    slug: "claude-red",
    titleId: "Claude-Red - Audit Keamanan Ofensif & Pentesting API",
    titleEn: "Claude-Red - Offensive Security & API Pentesting Suite",
    summaryId: "Kumpulan metodologi uji penetrasi dan keamanan ofensif mencakup OWASP API Security Top 10, otentikasi JWT, dan mitigasi SSRF.",
    summaryEn: "Curated offensive security testing library covering OWASP API Security Top 10, JWT attacks, and SSRF remediation.",
    contentId: `# Claude-Red Offensive Security Suite

Metodologi audit keamanan menyeluruh untuk mendeteksi celah kerentanan aplikasi dan infrastruktur cloud.

## Cakupan Uji Keamanan
1. **Broken Object Level Authorization (BOLA/IDOR)**: Validasi kepemilikan resource pada level controller.
2. **Broken Authentication**: Pengujian kebocoran token JWT, manipulasi algoritma enkripsi, dan bypass sesi.
3. **SSRF & Injection**: Sanitasi input URL eksternal dan perlindungan SQL query terhadap injeksi payload.`,
    contentEn: `# Claude-Red Offensive Security Suite

Comprehensive security audit methodology for detecting application vulnerabilities and cloud infrastructure flaws.

## Assessment Scope
1. **Broken Object Level Authorization (BOLA/IDOR)**: Verifying strict owner permissions on API routes.
2. **Broken Authentication**: Testing token leaks, JWT algorithm manipulation, and session hijacking.
3. **SSRF & Injection**: Sanitizing external resource requests and neutralizing SQL injection vectors.`,
    frontmatter: {
      name: "claude-red",
      license: "MIT",
      stars: 8116,
      author: "SnailSploit",
    },
    sourceType: "github",
    repoUrl: "https://github.com/SnailSploit/Claude-Red",
    filePath: "Skills/api/offensive-api-security/SKILL.md",
    branch: "main",
    commitHash: "6c2018a",
    license: "MIT",
    authorName: "SnailSploit",
    authorUrl: "https://github.com/SnailSploit",
    attribution: "SnailSploit (Claude-Red)",
    categoryId: "cat-code-automation",
    tags: ["security", "pentesting", "owasp", "api-security", "audit"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 8116,
    downloadCount: 1074,
  },
  {
    id: "skl_gamedev_agent_skills",
    slug: "gamedev-agent-skills",
    titleId: "GameDev Agent Skills - Arsitektur Engine & Shader Game",
    titleEn: "GameDev Agent Skills - Multi-Engine Game Development Suite",
    summaryId: "76 skill terstruktur untuk pengembangan game modern di engine Godot, Unity, Unreal, Three.js, Phaser, dan Roblox.",
    summaryEn: "76 portable agent skills for game development spanning Godot, Unity, Unreal, Three.js, Phaser, and Roblox.",
    contentId: `# Awesome GameDev Agent Skills

Koleksi instruksi skill terstruktur untuk membangun game, shader, dan pipeline aset 2D/3D dengan bantuan AI agent.

## Dukungan Engine
- **Web & 3D**: Three.js, PixiJS, Phaser, PlayCanvas.
- **Native Game Engine**: Godot (GDScript & C#), Unity, Unreal Engine 5.
- **Fokus Arsitektur**: State machine entitas, optimasi draw call, dan shader pipeline efisien.`,
    contentEn: `# Awesome GameDev Agent Skills

Structured skill collection for building games, shaders, and 2D/3D asset pipelines with AI coding agents.

## Supported Engines
- **Web & 3D**: Three.js, PixiJS, Phaser, PlayCanvas.
- **Native Game Engines**: Godot (GDScript & C#), Unity, Unreal Engine 5.
- **Architectural Focus**: Entity state machines, draw call batching, and shader pipeline efficiency.`,
    frontmatter: {
      name: "gamedev-agent-skills",
      license: "Apache-2.0",
      stars: 3079,
      author: "gamedev-skills",
    },
    sourceType: "github",
    repoUrl: "https://github.com/gamedev-skills/awesome-gamedev-agent-skills",
    filePath: "README.md",
    branch: "main",
    commitHash: "22ff91c",
    license: "Apache-2.0",
    authorName: "GameDev Skills Collective",
    authorUrl: "https://github.com/gamedev-skills",
    attribution: "gamedev-skills collective",
    categoryId: "cat-visual-design",
    tags: ["gamedev", "unity", "godot", "threejs", "shaders"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 3079,
    downloadCount: 282,
  },
  {
    id: "skl_claude_osint",
    slug: "claude-osint",
    titleId: "Claude-OSINT - Investigasi Intelijen & Threat Reconnaissance",
    titleEn: "Claude-OSINT - Open Source Threat Intelligence & Recon",
    summaryId: "Paket 8 skill dengan 100+ teknik pengumpulan intelijen sumber terbuka, 80 regex kredensial, dan 27 alur serangan terstruktur.",
    summaryEn: "8 modular skills with 100+ open-source intelligence capabilities, 80 secret regex patterns, and 27 threat attack paths.",
    contentId: `# Claude-OSINT Intelligence Suite

Framework investigasi intelijen keamanan open-source (OSINT) untuk audit permukaan serangan resmi.

## Modul Kemampuan
- **Passive Footprinting**: Pemetaan subdomain, SPF/DMARC record, dan sertifikat TLS publik.
- **Secret Detection**: 80 pola regex terverifikasi untuk mendeteksi kebocoran kredensial API.
- **Read-Only Validation**: Verifikasi keaslian endpoint tanpa mengirimkan payload destruktif.`,
    contentEn: `# Claude-OSINT Intelligence Suite

Open-source threat intelligence (OSINT) framework for authorized external attack surface assessments.

## Capability Modules
- **Passive Footprinting**: Subdomain enumeration, DNS records, and public certificate transparency logs.
- **Credential Detection**: 80 verified regex patterns for locating exposed API keys.
- **Read-Only Validation**: Probing endpoint authenticity without destructive payload transmission.`,
    frontmatter: {
      name: "claude-osint",
      license: "MIT",
      stars: 2851,
      author: "elementalsouls",
    },
    sourceType: "github",
    repoUrl: "https://github.com/elementalsouls/Claude-OSINT",
    filePath: "README.md",
    branch: "main",
    commitHash: "14a09e3",
    license: "MIT",
    authorName: "elementalsouls",
    authorUrl: "https://github.com/elementalsouls",
    attribution: "elementalsouls (Claude-OSINT)",
    categoryId: "cat-code-automation",
    tags: ["osint", "security", "threat-intelligence", "recon"],
    previewType: "none",
    images: [],
    status: "published",
    copyCount: 2851,
    downloadCount: 520,
  },
];

async function seedPremiumSkills() {
  console.log("Seeding 10 verified premium skills into Neon PostgreSQL...");

  for (const skill of premiumSkills) {
    const existing = await db
      .select({ id: schema.skills.id })
      .from(schema.skills)
      .where(eq(schema.skills.slug, skill.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.skills).values({
        ...skill,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`+ Inserted: ${skill.slug}`);
    } else {
      await db
        .update(schema.skills)
        .set({
          ...skill,
          updatedAt: new Date(),
        })
        .where(eq(schema.skills.slug, skill.slug));
      console.log(`~ Updated: ${skill.slug}`);
    }
  }

  console.log("All 10 premium skills seeded successfully!");
}

seedPremiumSkills()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
