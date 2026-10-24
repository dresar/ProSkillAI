import type { McpServerItem } from "@/data/mcp-catalog";

const SLUG_LOGOS: Record<string, string> = {
  "langchain-mcp": "/images/mcp/logos/langchain.png",
  "langgraph-mcp": "/images/mcp/logos/langchain.png",
  "llamaindex-mcp": "/images/mcp/logos/llamaindex.png",
  "crewai-mcp": "/images/mcp/logos/crewai.png",
  "autogen-mcp": "/images/mcp/logos/microsoft.png",
  "semantic-kernel-mcp": "/images/mcp/logos/microsoft.png",
  "promptflow-mcp": "/images/mcp/logos/microsoft.png",
  "smolagents-mcp": "/images/mcp/logos/huggingface.png",
  "pydanticai-mcp": "/images/mcp/logos/pydantic.png",
  "cloudflare-sandbox-mcp": "/images/mcp/logos/cloudflare.png",
  "cloudflare-mcp": "/images/mcp/logos/cloudflare.png",
  "brave-search-mcp": "/images/mcp/logos/brave.png",
  "github-mcp": "/images/mcp/logos/github.png",
  "google-drive-mcp": "/images/mcp/logos/google.png",
  "google-maps-mcp": "/images/mcp/logos/google.png",
  "notion-mcp": "/images/mcp/logos/notion.png",
  "ollama-mcp": "/images/mcp/logos/ollama.png",
  "docker-engine-mcp": "/images/mcp/logos/docker.png",
  "docker-mcp": "/images/mcp/logos/docker.png",
  "postgres-mcp": "/images/mcp/logos/postgresql.png",
  "postgresql-mcp": "/images/mcp/logos/postgresql.png",
  "redis-mcp": "/images/mcp/logos/redis.png",
  "mongodb-mcp": "/images/mcp/logos/mongodb.png",
  "sqlite-mcp": "/images/mcp/logos/sqlite.png",
};

const VENDOR_LOGOS: Record<string, string> = {
  "langchain ai": "/images/mcp/logos/langchain.png",
  "llamaindex": "/images/mcp/logos/llamaindex.png",
  "crewai": "/images/mcp/logos/crewai.png",
  "microsoft": "/images/mcp/logos/microsoft.png",
  "hugging face": "/images/mcp/logos/huggingface.png",
  "pydantic": "/images/mcp/logos/pydantic.png",
  "cloudflare": "/images/mcp/logos/cloudflare.png",
  "docker": "/images/mcp/logos/docker.png",
  "google": "/images/mcp/logos/google.png",
  "github": "/images/mcp/logos/github.png",
  "notion": "/images/mcp/logos/notion.png",
  "brave": "/images/mcp/logos/brave.png",
};

export function getMcpLogo(server: McpServerItem): string | null {
  if (server.logoUrl) return server.logoUrl;
  if (SLUG_LOGOS[server.slug]) return SLUG_LOGOS[server.slug];

  const vendorKey = (server.vendor || "").toLowerCase().trim();
  if (VENDOR_LOGOS[vendorKey]) return VENDOR_LOGOS[vendorKey];

  return null;
}
