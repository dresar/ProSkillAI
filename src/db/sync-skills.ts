import fs from "node:fs";
import path from "node:path";
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

const SUPERPOWERS_IMAGES = [
  "/images/superpowers/slide-1-brainstorming.svg",
  "/images/superpowers/slide-2-tdd.svg",
  "/images/superpowers/slide-3-subagents.svg",
  "/images/superpowers/slide-4-debugging.svg",
  "/images/superpowers/slide-5-executing-plans.svg",
];

const SKILL_DEFINITIONS = [
  {
    id: "skl_superpowers",
    slug: "superpowers",
    titleId: "Superpowers - Framework Metodologi Rekayasa Software",
    titleEn: "Superpowers - Agentic Software Engineering Framework",
    summaryId: "Framework metodologi pengembangan software agentic dengan alur kerja brainstorming wajib, perancangan rencana, dan subagent development.",
    summaryEn: "Foundational software development methodology for coding agents enforcing brainstorming, plan execution, and subagent development.",
    rawUrl: "https://raw.githubusercontent.com/obra/superpowers/main/skills/brainstorming/SKILL.md",
    fallbackContent: `# Superpowers

An agentic skills framework and software engineering methodology that produces verified, reliable code.

## Included Skills
1. **Brainstorming**: Deep exploration of requirements, user intent, and architecture before code changes.
2. **Executing Plans**: Step-by-step execution checkpoints with verified assertions.
3. **Subagent-Driven Development**: Isolated parallel worker dispatching to protect reasoning context.
4. **Systematic Debugging**: Scientific hypothesis-driven root cause analysis before making code edits.

## Installation
\`\`\`bash
claude plugin add obra/superpowers
\`\`\`
`,
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
    previewType: "gallery",
    previewImageUrl: SUPERPOWERS_IMAGES[0],
    images: SUPERPOWERS_IMAGES,
    status: "published" as const,
    copyCount: 304040,
    downloadCount: 27080,
  },
  {
    id: "skl_neon_postgres",
    slug: "neon-postgres",
    titleId: "Neon Postgres - Arsitektur Database Serverless & Branching",
    titleEn: "Neon Postgres - Serverless Database & Branching Architecture",
    summaryId: "Panduan dan praktik terbaik Lakebase Postgres di Neon: koneksi pooling, migrasi skema, instant branching, autoscaling, dan vector search.",
    summaryEn: "Guides and best practices for serverless Postgres on Neon: pooled connections, migrations, instant branching, autoscaling, and vector search.",
    rawUrl: "https://raw.githubusercontent.com/neondatabase/agent-skills/main/skills/neon-postgres/SKILL.md",
    frontmatter: {
      name: "neon-postgres",
      version: "1.0.0",
      license: "MIT",
      stars: 19800,
      author: "neondatabase",
    },
    sourceType: "github",
    repoUrl: "https://github.com/neondatabase/agent-skills",
    filePath: "skills/neon-postgres/SKILL.md",
    branch: "main",
    commitHash: "d7a4b8e",
    license: "MIT",
    authorName: "Neon Database",
    authorUrl: "https://github.com/neondatabase",
    attribution: "Neon Database (Official Agent Skills)",
    categoryId: "cat-architecture",
    tags: ["postgres", "neon", "serverless", "database", "branching", "sql"],
    previewType: "none",
    previewImageUrl: null,
    images: [],
    status: "published" as const,
    copyCount: 19800,
    downloadCount: 2450,
  },
  {
    id: "skl_nextjs_turbopack",
    slug: "nextjs-turbopack",
    titleId: "Next.js & Turbopack - Bundling Inkremental & Kecepatan Dev",
    titleEn: "Next.js & Turbopack - Incremental Bundling & Dev Speed",
    summaryId: "Next.js 16+ dan Turbopack: bundler inkremental berbasis Rust, FS caching, perbandingan Turbopack vs webpack, dan panduan troubleshooting.",
    summaryEn: "Next.js 16+ and Turbopack: Rust-based incremental bundling, FS caching, webpack comparisons, and practical troubleshooting guide.",
    rawUrl: "https://raw.githubusercontent.com/affaan-m/ECC/main/.agents/skills/nextjs-turbopack/SKILL.md",
    frontmatter: {
      name: "nextjs-turbopack",
      version: "1.0.0",
      license: "MIT",
      stars: 279616,
      author: "affaan-m",
    },
    sourceType: "github",
    repoUrl: "https://github.com/affaan-m/ECC",
    filePath: ".agents/skills/nextjs-turbopack/SKILL.md",
    branch: "main",
    commitHash: "b8c31fe",
    license: "MIT",
    authorName: "Affaan Mustafa",
    authorUrl: "https://github.com/affaan-m",
    attribution: "Affaan Mustafa (ECC Suite)",
    categoryId: "cat-code-automation",
    tags: ["nextjs", "turbopack", "react", "bundler", "performance"],
    previewType: "none",
    previewImageUrl: null,
    images: [],
    status: "published" as const,
    copyCount: 279616,
    downloadCount: 15320,
  },
  {
    id: "skl_coding_agent",
    slug: "coding-agent",
    titleId: "Coding Agent - Delegasi Pekerjaan Koding ke Background Workers",
    titleEn: "Coding Agent - Background Worker Task Delegation",
    summaryId: "Pola delegasi tugas koding intensif ke Codex, Claude Code, atau OpenCode sebagai background worker tanpa membebani reasoning parent agent.",
    summaryEn: "Delegate intense coding implementation work to Codex, Claude Code, or OpenCode as isolated background workers.",
    rawUrl: "https://raw.githubusercontent.com/openclaw/openclaw/main/skills/coding-agent/SKILL.md",
    frontmatter: {
      name: "coding-agent",
      version: "1.0.0",
      license: "MIT",
      stars: 392094,
      author: "openclaw",
    },
    sourceType: "github",
    repoUrl: "https://github.com/openclaw/openclaw",
    filePath: "skills/coding-agent/SKILL.md",
    branch: "main",
    commitHash: "f1a23c8",
    license: "MIT",
    authorName: "OpenClaw Team",
    authorUrl: "https://github.com/openclaw",
    attribution: "OpenClaw Autonomous Ecosystem",
    categoryId: "cat-code-automation",
    tags: ["coding-agent", "subagent", "background-workers", "automation"],
    previewType: "none",
    previewImageUrl: null,
    images: [],
    status: "published" as const,
    copyCount: 392094,
    downloadCount: 42100,
  },
  {
    id: "skl_wayfinder",
    slug: "wayfinder",
    titleId: "Wayfinder - Pemetaan Rencana Keputusan Multi-Sesi Agent",
    titleEn: "Wayfinder - Multi-Session Decision Mapping for Coding Agents",
    summaryId: "Memecah tugas rekayasa berskala raksasa menjadi peta tiket keputusan di issue tracker dan menyelesaikannya secara bertahap hingga selesai.",
    summaryEn: "Plan massive chunks of engineering work across multiple agent sessions as a shared map of decision tickets resolved systematically.",
    rawUrl: "https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/wayfinder/SKILL.md",
    frontmatter: {
      name: "wayfinder",
      version: "1.0.0",
      license: "MIT",
      stars: 292968,
      author: "mattpocock",
    },
    sourceType: "github",
    repoUrl: "https://github.com/mattpocock/skills",
    filePath: "skills/engineering/wayfinder/SKILL.md",
    branch: "main",
    commitHash: "e4d72b1",
    license: "MIT",
    authorName: "Matt Pocock",
    authorUrl: "https://github.com/mattpocock",
    attribution: "Matt Pocock (Agent Skills)",
    categoryId: "cat-architecture",
    tags: ["planning", "engineering", "roadmap", "architecture", "decisions"],
    previewType: "none",
    previewImageUrl: null,
    images: [],
    status: "published" as const,
    copyCount: 292968,
    downloadCount: 31200,
  },
  {
    id: "skl_neon_realtime",
    slug: "neon-realtime",
    titleId: "Neon Realtime - Arsitektur Sinkronisasi & Reaktivitas Data",
    titleEn: "Neon Realtime - Data Reactivity & State Synchronization",
    summaryId: "Menambahkan langganan data realtime ke aplikasi web menggunakan Postgres CDC, SSE, SSR streaming, dan mutasi optimis.",
    summaryEn: "Add realtime state subscriptions and data reactivity to web applications using Postgres CDC, SSE, and optimistic mutations.",
    rawUrl: "https://raw.githubusercontent.com/neondatabase/agent-skills/main/skills/neon-realtime/SKILL.md",
    frontmatter: {
      name: "neon-realtime",
      version: "1.0.0",
      license: "MIT",
      stars: 19800,
      author: "neondatabase",
    },
    sourceType: "github",
    repoUrl: "https://github.com/neondatabase/agent-skills",
    filePath: "skills/neon-realtime/SKILL.md",
    branch: "main",
    commitHash: "d7a4b8e",
    license: "MIT",
    authorName: "Neon Database",
    authorUrl: "https://github.com/neondatabase",
    attribution: "Neon Database (Official Agent Skills)",
    categoryId: "cat-architecture",
    tags: ["realtime", "postgres", "sse", "reactivity", "websockets"],
    previewType: "none",
    previewImageUrl: null,
    images: [],
    status: "published" as const,
    copyCount: 19800,
    downloadCount: 1980,
  },
];

async function syncAllSkills() {
  const localSkillsDir = path.resolve(process.cwd(), "skills");
  if (!fs.existsSync(localSkillsDir)) {
    fs.mkdirSync(localSkillsDir, { recursive: true });
  }

  for (const def of SKILL_DEFINITIONS) {
    let content = def.fallbackContent || "";

    if (def.rawUrl) {
      try {
        const res = await fetch(def.rawUrl, {
          headers: { "User-Agent": "Skills-Biz-Id" },
        });
        if (res.ok) {
          content = await res.text();
        }
      } catch {}
    }

    if (!content) {
      content = `# ${def.slug}\n\n${def.summaryEn}\n`;
    }

    const skillFolder = path.join(localSkillsDir, def.slug);
    if (!fs.existsSync(skillFolder)) {
      fs.mkdirSync(skillFolder, { recursive: true });
    }
    fs.writeFileSync(path.join(skillFolder, "SKILL.md"), content, "utf-8");

    const existing = await db
      .select({ id: schema.skills.id })
      .from(schema.skills)
      .where(eq(schema.skills.slug, def.slug))
      .limit(1);

    const record = {
      slug: def.slug,
      titleId: def.titleId,
      titleEn: def.titleEn,
      summaryId: def.summaryId,
      summaryEn: def.summaryEn,
      contentId: content,
      contentEn: content,
      frontmatter: def.frontmatter,
      sourceType: def.sourceType,
      repoUrl: def.repoUrl,
      filePath: def.filePath,
      branch: def.branch,
      commitHash: def.commitHash,
      license: def.license,
      authorName: def.authorName,
      authorUrl: def.authorUrl,
      attribution: def.attribution,
      categoryId: def.categoryId,
      tags: def.tags,
      previewType: def.previewType,
      previewImageUrl: def.previewImageUrl,
      images: def.images,
      status: def.status,
      copyCount: def.copyCount,
      downloadCount: def.downloadCount,
      updatedAt: new Date(),
    };

    if (existing.length === 0) {
      await db.insert(schema.skills).values({
        id: def.id,
        ...record,
        createdAt: new Date(),
      });
      console.log(`Inserted skill: ${def.slug}`);
    } else {
      await db
        .update(schema.skills)
        .set(record)
        .where(eq(schema.skills.slug, def.slug));
      console.log(`Updated skill: ${def.slug}`);
    }
  }

  console.log("All skills synced and written to local repo!");
}

syncAllSkills()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
  });
