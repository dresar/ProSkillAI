interface HomeSeoSchemaProps {
  locale: string;
}

export function HomeSeoSchema({ locale }: HomeSeoSchemaProps) {
  const isEn = locale === "en";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ProSkillAI",
    alternateName: ["Skills.biz.id", "Skills Registry", "ProSkill AI"],
    url: `${baseUrl}/${locale}`,
    description: isEn
      ? "Curated open-source registry of production-ready AI agent skills, MCP servers, and developer prompt engineering systems."
      : "Direktori terkurasi terbuka untuk skill agen AI siap produksi, server MCP, dan templat prompt developer.",
    inLanguage: isEn ? "en" : "id",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/${locale}/skills?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ProSkillAI",
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    sameAs: [
      "https://github.com/dresar/ProSkillAI",
    ],
    description: isEn
      ? "ProSkillAI provides standardized, test-verified AI agent skills and prompt engineering workflows for Claude Code, Cursor, Codex, and Antigravity."
      : "ProSkillAI menyediakan skill agen AI terstandarisasi dan alur rekayasa prompt terverifikasi untuk Claude Code, Cursor, Codex, dan Antigravity.",
    knowsAbout: [
      "Artificial Intelligence Agents",
      "Model Context Protocol",
      "Claude Code CLI",
      "Prompt Engineering",
      "Test-Driven Development",
    ],
  };

  const softwareCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: isEn ? "ProSkillAI Agent Skills Directory" : "Direktori Skill Agen ProSkillAI",
    description: isEn
      ? "Comprehensive directory of 27+ production-verified AI agent skills and 139 MCP server integrations."
      : "Direktori lengkap berisi 27+ skill agen AI terverifikasi produksi dan 139 integrasi server MCP.",
    url: `${baseUrl}/${locale}/skills`,
    publisher: {
      "@type": "Organization",
      name: "ProSkillAI",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareCatalogSchema) }}
      />
    </>
  );
}
