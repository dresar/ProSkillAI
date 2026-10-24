"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface McpImageGalleryProps {
  images: string[];
  alt: string;
}

export function McpImageGallery({ images, alt }: McpImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  const validImages = images && images.length > 0 ? images : ["/images/mcp/default.svg"];
  const total = validImages.length;

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  React.useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
      if (e.key === "ArrowRight") setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, total]);

  return (
    <div className="w-full space-y-2.5">
      <div
        className="group/gallery relative aspect-16/9 w-full rounded-xl overflow-hidden border border-border/80 bg-black/80 shadow-sm select-none cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={validImages[activeIndex]}
          alt={`${alt} slide ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          unoptimized
          className="object-contain transition-all duration-200"
        />

        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            aria-label="Fullscreen zoom"
            className="w-7 h-7 rounded-[5px] bg-black/60 hover:bg-black/85 backdrop-blur-xs text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous preview"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-[5px] bg-black/60 hover:bg-black/85 backdrop-blur-xs text-white border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover/gallery:opacity-100 cursor-pointer active:scale-95 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next preview"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-[5px] bg-black/60 hover:bg-black/85 backdrop-blur-xs text-white border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover/gallery:opacity-100 cursor-pointer active:scale-95 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="absolute bottom-2 left-3 z-10 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-[4px] bg-black/60 backdrop-blur-xs text-white/90 font-mono text-[10px] font-semibold border border-white/10">
            {activeIndex + 1} / {total}
          </span>
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-6 px-2.5 rounded-[4px] text-[10px] font-mono font-semibold transition-all cursor-pointer active:scale-95 ${
                idx === activeIndex
                  ? "bg-foreground text-background shadow-2xs border border-foreground"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen view"
            className="absolute top-4 right-4 w-8 h-8 rounded-[6px] border border-white/20 bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer z-50"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-16/9 rounded-xl overflow-hidden border border-white/15 bg-black flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validImages[activeIndex]}
              alt={`${alt} fullscreen ${activeIndex + 1}`}
              fill
              unoptimized
              className="object-contain"
            />

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[6px] bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[6px] bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded-[5px] bg-black/75 border border-white/20 text-white font-mono text-xs">
              {activeIndex + 1} / {total} · {alt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}