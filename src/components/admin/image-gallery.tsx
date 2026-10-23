"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  autoSlideInterval?: number;
}

export function ImageGallery({
  images,
  alt,
  className = "",
  autoSlideInterval = 3500,
}: ImageGalleryProps) {
  const validImages = images.filter(Boolean);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (validImages.length <= 1 || isPaused || lightboxIndex !== null) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [validImages.length, isPaused, lightboxIndex, autoSlideInterval]);

  React.useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  React.useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
        return;
      }
      if (validImages.length < 2) return;
      if (event.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? prev : (prev + 1) % validImages.length
        );
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? prev
            : (prev - 1 + validImages.length) % validImages.length
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, validImages.length]);

  if (validImages.length === 0) return null;

  const goPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const goLightboxPrev = () => {
    setLightboxIndex((prev) =>
      prev === null ? prev : (prev - 1 + validImages.length) % validImages.length
    );
  };

  const goLightboxNext = () => {
    setLightboxIndex((prev) =>
      prev === null ? prev : (prev + 1) % validImages.length
    );
  };

  return (
    <div
      className={`space-y-3 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-2xl border border-border bg-muted/40 overflow-hidden shadow-sm group">
        <Image
          src={validImages[currentIndex]}
          alt={`${alt} slide ${currentIndex + 1}`}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 900px"
          priority
          className="object-cover transition-all duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-mono text-white/90 border border-white/10 shadow-xs tabular-nums">
            {currentIndex + 1} / {validImages.length}
          </div>

          <button
            type="button"
            onClick={() => setLightboxIndex(currentIndex)}
            aria-label="Expand image"
            title="Expand image"
            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-xs text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-xs text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {validImages.map((src, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative w-16 h-10 sm:w-20 sm:h-12 rounded-lg border overflow-hidden shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "border-blue-500 ring-2 ring-blue-500/40 shadow-xs"
                    : "border-border/70 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {lightboxIndex !== null && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri ${alt}`}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10 border border-white/10 active:scale-95"
            aria-label="Tutup galeri"
          >
            <X className="w-5 h-5" />
          </button>

          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goLightboxPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10 border border-white/10 active:scale-95"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={validImages[lightboxIndex]}
              alt={`${alt} ${lightboxIndex + 1}`}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goLightboxNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10 border border-white/10 active:scale-95"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="absolute bottom-4 px-3 py-1 rounded-full bg-black/70 border border-white/15 text-white/90 text-xs font-mono tabular-nums">
            {lightboxIndex + 1} / {validImages.length}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
