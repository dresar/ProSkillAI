"use client";

import * as React from "react";
import { Share2 } from "lucide-react";
import type { ShareItemData } from "@/types/share";
import { ShareModal } from "./share-modal";

interface ShareButtonProps {
  item: ShareItemData;
  locale?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ShareButton({
  item,
  locale = "id",
  className = "",
  showLabel = false,
  label,
}: ShareButtonProps) {
  const [open, setOpen] = React.useState(false);
  const isEn = locale === "en";
  const defaultLabel = isEn ? "Share" : "Bagikan";
  const displayLabel = label || defaultLabel;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={displayLabel}
        title={displayLabel}
        className={`inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${className}`}
      >
        <Share2 className="w-3.5 h-3.5" />
        {showLabel && (
          <span className="text-xs font-semibold">{displayLabel}</span>
        )}
      </button>

      {open && (
        <ShareModal
          item={item}
          locale={locale}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
