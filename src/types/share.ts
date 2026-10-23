export type ShareItemType = "skill" | "prompt" | "repo" | "mcp";

export type SharePalette = "zinc" | "emerald" | "violet" | "cyan" | "amber" | "sunset";

export type ShareTheme = "dark" | "light";

export interface ShareStatItem {
  label: string;
  value: string | number;
}

export interface ShareItemData {
  type: ShareItemType;
  title: string;
  description: string;
  url: string;
  category?: string;
  author?: string;
  stats?: ShareStatItem[];
  badge?: string;
  slug?: string;
}
