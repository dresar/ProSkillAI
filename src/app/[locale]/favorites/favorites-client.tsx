"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Trash2, Layers, FileCode, ArrowRight, Bookmark } from "lucide-react";
import { getFavorites, onFavoritesChange, toggleFavorite, type FavoriteItem } from "@/lib/favorites";

export function FavoritesClient({ locale }: { locale: string }) {
  const [items, setItems] = React.useState<FavoriteItem[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | "skill" | "prompt">("all");

  const isEn = locale === "en";

  React.useEffect(() => {
    setItems(getFavorites());
    setMounted(true);
    const unsub = onFavoritesChange(() => {
      setItems(getFavorites());
    });
    return unsub;
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
        {isEn ? "Loading favorites..." : "Memuat favorit..."}
      </div>
    );
  }

  const filtered = items.filter((x) => {
    if (filter === "skill") return x.type === "skill";
    if (filter === "prompt") return x.type === "prompt";
    return true;
  });

  const skillCount = items.filter((x) => x.type === "skill").length;
  const promptCount = items.filter((x) => x.type === "prompt").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{isEn ? "Personal Collection" : "Koleksi Pribadi"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isEn ? "Starred & Favorited Items" : "Skill & Prompt Favorit"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isEn
              ? "Collection of skills and prompt templates saved to this browser for rapid access."
              : "Daftar skill dan templat prompt yang Anda simpan untuk akses cepat kapan saja."}
          </p>
        </div>

        <div className="inline-flex rounded-[6px] border border-border p-0.5 bg-muted/50 shrink-0">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-surface text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{isEn ? "All" : "Semua"}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted">
              {items.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("skill")}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
              filter === "skill"
                ? "bg-surface text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Skills</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted">
              {skillCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("prompt")}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] text-xs font-medium transition-colors cursor-pointer ${
              filter === "prompt"
                ? "bg-surface text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCode className="w-3 h-3" />
            <span>Prompts</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted">
              {promptCount}
            </span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 px-4 text-center border border-dashed border-border rounded-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              {isEn ? "No saved items yet" : "Belum ada item favorit"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {isEn
                ? "Click the star icon on any skill or prompt in the catalog to add it here."
                : "Klik ikon bintang pada skill atau prompt apa pun di katalog untuk menyimpannya di sini."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Link
              href={`/${locale}/skills`}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-colors"
            >
              <span>{isEn ? "Explore Skills" : "Jelajahi Skill"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href={`/${locale}/prompts`}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-colors"
            >
              <span>{isEn ? "Explore Prompts" : "Jelajahi Prompt"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((item) => {
            const href =
              item.type === "skill"
                ? `/${locale}/skills/${item.slug}`
                : `/${locale}/prompts/${item.slug}`;

            return (
              <article
                key={item.id}
                className="group rounded-xl border border-border/80 bg-surface overflow-hidden flex flex-col hover:border-foreground/30 hover:shadow-xs transition-all duration-200"
              >
                <div className="relative aspect-video bg-muted overflow-hidden block">
                  {item.cover ? (
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      {item.type === "skill" ? (
                        <Layers className="w-6 h-6" />
                      ) : (
                        <FileCode className="w-6 h-6" />
                      )}
                    </div>
                  )}

                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[4px] bg-background/85 backdrop-blur-xs text-foreground font-semibold border border-border">
                      {item.type}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(item)}
                    title={isEn ? "Remove from favorites" : "Hapus dari favorit"}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-[5px] bg-background/85 backdrop-blur-xs border border-border text-amber-500 hover:text-rose-500 hover:border-rose-500/40 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 flex-1">
                  {item.category && (
                    <span className="text-[10px] text-muted-foreground font-medium truncate">
                      {item.category}
                    </span>
                  )}

                  <Link href={href} className="min-w-0 block group-hover:underline">
                    <h3 className="font-semibold text-xs sm:text-sm text-foreground truncate">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-auto pt-2.5 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      /{item.slug}
                    </span>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline"
                    >
                      <span>{isEn ? "Open" : "Buka"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
