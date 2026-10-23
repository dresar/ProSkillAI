"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageGallery({ images, alt, className = "" }: ImageGalleryProps) {
  const validImages = images.filter(Boolean);
  const [active, setActive] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (active !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  React.useEffect(() => {
    if (active === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        return;
      }
      if (validImages.length < 2) return;
      if (event.key === "ArrowRight") {
        setActive((prev) => (prev === null ? prev : (prev + 1) % validImages.length));
      }
      if (event.key === "ArrowLeft") {
        setActive((prev) =>
          prev === null ? prev : (prev - 1 + validImages.length) % validImages.length
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, validImages.length]);

  if (validImages.length === 0) return null;

  const close = () => setActive(null);
  const goPrev = () =>
    setActive((prev) =>
      prev === null ? prev : (prev - 1 + validImages.length) % validImages.length
    );
  const goNext = () =>
    setActive((prev) => (prev === null ? prev : (prev + 1) % validImages.length));

  return (
    <>
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${className}`}>
        {validImages.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className="relative aspect-video rounded-lg border border-border bg-muted overflow-hidden group cursor-zoom-in"
            aria-label={`Buka gambar ${index + 1}`}
          >
            <Image
              src={src}
              alt={`${alt} ${index + 1}`}
              fill
              unoptimized
              sizes="(max-width: 768px) 50vw, 300px"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active !== null && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri ${alt}`}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
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
                goPrev();
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
              src={validImages[active]}
              alt={`${alt} ${active + 1}`}
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
                goNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10 border border-white/10 active:scale-95"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="absolute bottom-4 px-3 py-1 rounded-full bg-black/70 border border-white/15 text-white/90 text-xs font-mono tabular-nums">
            {active + 1} / {validImages.length}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
