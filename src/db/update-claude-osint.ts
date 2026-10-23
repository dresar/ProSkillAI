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

const SUB_SKILLS = [
  { id: "osint-methodology", name: "osint-methodology.md", path: "skills/osint-methodology/SKILL.md" },
  { id: "offensive-osint", name: "offensive-osint.md", path: "skills/offensive-osint/SKILL.md" },
  { id: "org-attack-surface", name: "org-attack-surface.md", path: "skills/org-attack-surface/SKILL.md" },
  { id: "email-domain-security", name: "email-domain-security.md", path: "skills/email-domain-security/SKILL.md" },
  { id: "exposure-risk-quantification", name: "exposure-risk-quantification.md", path: "skills/exposure-risk-quantification/SKILL.md" },
  { id: "continuous-exposure-monitoring", name: "continuous-exposure-monitoring.md", path: "skills/continuous-exposure-monitoring/SKILL.md" },
  { id: "cloud-saas-exposure", name: "cloud-saas-exposure.md", path: "skills/cloud-saas-exposure/SKILL.md" },
  { id: "identity-provider-recon", name: "identity-provider-recon.md", path: "skills/identity-provider-recon/SKILL.md" },
];

const RAW_BASE = "https://raw.githubusercontent.com/elementalsouls/Claude-OSINT/main";
const BANNER_URL = `${RAW_BASE}/assets/banner.png`;

async function main() {
  console.log("Fetching latest full content and sub-skills from elementalsouls/Claude-OSINT...");

  const readmeRes = await fetch(`${RAW_BASE}/README.md`);
  if (!readmeRes.ok) {
    throw new Error(`Failed to fetch README.md: ${readmeRes.status}`);
  }
  const readmeContent = await readmeRes.text();

  const files = [];
  for (const s of SUB_SKILLS) {
    try {
      console.log(`- Fetching ${s.path}...`);
      const res = await fetch(`${RAW_BASE}/${s.path}`);
      if (res.ok) {
        const text = await res.text();
        files.push({
          id: s.id,
          name: s.name,
          content: text,
          language: "markdown",
          size: text.length,
        });
      }
    } catch (err) {
      console.warn(`Could not fetch ${s.path}:`, err);
    }
  }

  const normalizedReadme = readmeContent.replace(/assets\/banner\.png/g, BANNER_URL);

  console.log(`Updating skill claude-osint in Neon DB (README: ${normalizedReadme.length} chars, Files: ${files.length})...`);

  await db
    .update(schema.skills)
    .set({
      titleId: "Claude-OSINT - Suite Intelijen Ancaman Ofensif & Recon",
      titleEn: "Claude-OSINT - Offensive Recon & Threat Intelligence Suite",
      summaryId: "Suite 8 skill Claude, 100+ kapabilitas recon, 80 pola regex rahasia, dan 27 template jalur serangan untuk operasi red-team dan bug bounty terotorisasi.",
      summaryEn: "Suite of 8 modular Claude skills, 100+ recon capabilities, 80 secret-regex patterns, and 27 attack-path templates turning Claude into an offensive recon operator.",
      contentId: normalizedReadme,
      contentEn: normalizedReadme,
      previewImageUrl: BANNER_URL,
      images: [BANNER_URL],
      files: files,
      frontmatter: {
        name: "claude-osint",
        rank: "S-rank",
        stars: 2851,
        forks: 520,
        contributors: 5,
        installCommand: "npx skills add elementalsouls/Claude-OSINT",
        version: "2.3",
      },
      updatedAt: new Date(),
    })
    .where(eq(schema.skills.slug, "claude-osint"));

  console.log("Skill claude-osint successfully updated with full tradecraft content, 8 auxiliary skills, and official CDN banner!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error updating claude-osint:", err);
  process.exit(1);
});
