"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { isFavorite, toggleFavorite, onFavoritesChange, type FavoriteItem } from "@/lib/favorites";

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, "timestamp">;
  className?: string;
  showLabel?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function FavoriteButton({
  item,
  className = "",
  showLabel = false,
  activeLabel = "Tersimpan",
  inactiveLabel = "Favorit",
}: FavoriteButtonProps) {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    setActive(isFavorite(item.id));
    const unsubscribe = onFavoritesChange(() => {
      setActive(isFavorite(item.id));
    });
    return unsubscribe;
  }, [item.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = toggleFavorite(item);
    setActive(nextState);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Hapus dari favorit" : "Tambah ke favorit"}
      className={`inline-flex items-center gap-1.5 transition-all cursor-pointer ${
        active
          ? "text-amber-500 hover:text-amber-600"
          : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      <Star
        className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
          active ? "fill-amber-400 text-amber-500" : ""
        }`}
      />
      {showLabel && (
        <span className="text-xs font-medium">{active ? activeLabel : inactiveLabel}</span>
      )}
    </button>
  );
}
