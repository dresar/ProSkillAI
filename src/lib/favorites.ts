export interface FavoriteItem {
  id: string;
  type: "skill" | "prompt";
  slug: string;
  title: string;
  summary: string;
  category?: string | null;
  cover?: string | null;
  timestamp: number;
}

const STORAGE_KEY = "proskillai_favorites_v1";
const EVENT_NAME = "proskillai_favorites_change";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  if (typeof window === "undefined") return false;
  const list = getFavorites();
  return list.some((item) => item.id === id);
}

export function toggleFavorite(item: Omit<FavoriteItem, "timestamp">): boolean {
  if (typeof window === "undefined") return false;
  const list = getFavorites();
  const index = list.findIndex((x) => x.id === item.id);
  let next: FavoriteItem[];
  let active = false;

  if (index >= 0) {
    next = list.filter((x) => x.id !== item.id);
    active = false;
  } else {
    next = [{ ...item, timestamp: Date.now() }, ...list];
    active = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { count: next.length } }));
  } catch {}

  return active;
}

export function onFavoritesChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}
