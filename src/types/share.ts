export type ShareItemType = "skill" | "prompt" | "repo" | "mcp";

export type SharePalette = "zinc" | "emerald" | "violet" | "cyan" | "amber" | "sunset";

export type ShareTheme = "dark" | "light";

export type ShareAspectRatio = "1:1" | "3:4" | "9:16" | "16:9";

export interface ShareStatItem {
  label: string;
  value: string | number;
}

export interface ShareUserAttribution {
  username: string;
  show: boolean;
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
