"use client";

import * as React from "react";
import { X, Search, UploadCloud, Copy, Check, Image as ImageIcon, AlertCircle, Loader2 } from "lucide-react";
import { getUploadedMediaList, type MediaFileItem } from "@/app/admin/media/actions";
import { UploadModal } from "@/components/admin/upload-modal";
import { formatShortMediaName } from "@/lib/media-utils";

interface MediaGalleryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (url: string, item: MediaFileItem) => void;
  title?: string;
  defaultFolder?: string;
}

const FOLDERS = ["all", "skills", "prompts", "ui", "general"];

export function MediaGalleryDialog({
  open,
  onClose,
  onSelect,
  title = "Pustaka Galeri Media & CDN",
  defaultFolder = "all",
}: MediaGalleryDialogProps) {
  const [items, setItems] = React.useState<MediaFileItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [activeFolder, setActiveFolder] = React.useState(defaultFolder);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const loadMedia = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUploadedMediaList();
      setItems(data);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      void loadMedia();
    }
  }, [open, loadMedia]);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesFolder = activeFolder === "all" || item.folder.toLowerCase() === activeFolder.toLowerCase();
      const matchesSearch = !search.trim() || item.name.toLowerCase().includes(search.toLowerCase());
      return matchesFolder && matchesSearch;
    });
  }, [items, activeFolder, search]);

  const handleCopy = async (item: MediaFileItem) => {
    try {
      await navigator.clipboard.writeText(item.cdnUrl || item.rawUrl || item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[8px] border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-foreground" />
            <h3 className="text-xs font-bold text-foreground tracking-tight">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 border-b border-border bg-muted/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex h-8.5 items-center gap-1.5 rounded-[6px] bg-foreground px-4 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Unggah Media Baru</span>
              </button>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari gambar..."
                className="w-full h-8.5 pl-8 pr-3 rounded-[6px] border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {FOLDERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFolder(f)}
                className={`h-6 px-2.5 rounded-[4px] border text-[11px] font-mono transition-colors cursor-pointer ${
                  activeFolder === f
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="text-[11px] text-muted-foreground font-mono ml-auto">
              {filteredItems.length} gambar
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-muted-foreground text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-foreground" />
              <span>Memuat galeri media...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-xs space-y-1">
              <ImageIcon className="w-8 h-8 opacity-40" />
              <span>Tidak ada gambar ditemukan.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => {
                const shortName = formatShortMediaName(item.name);
                return (
                  <div
                    key={item.id}
                    className="group rounded-[8px] border border-border bg-surface overflow-hidden flex flex-col justify-between hover:border-foreground/40 transition-all shadow-2xs"
                  >
                    <div
                      onClick={() => {
                        if (onSelect) {
                          onSelect(item.cdnUrl, item);
                          onClose();
                        }
                      }}
                      className="relative aspect-square w-full cursor-pointer overflow-hidden bg-background"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-2.5 space-y-2 border-t border-border/80">
                      <div className="text-xs font-bold font-mono text-foreground truncate" title={item.name}>
                        {shortName}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onSelect && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelect(item.cdnUrl, item);
                              onClose();
                            }}
                            className="flex-1 h-8 inline-flex items-center justify-center rounded-[5px] bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            Pilih
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopy(item)}
                          className={`h-8 px-2.5 inline-flex items-center justify-center gap-1 rounded-[5px] border border-border bg-background text-xs font-semibold transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-2xs ${
                            onSelect ? "" : "w-full"
                          }`}
                          title="Salin CDN URL"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="text-emerald-500">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <span>Salin CDN</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/10 text-xs">
          <span className="text-[11px] font-mono text-muted-foreground truncate max-w-md">
            CDN GitHub jsDelivr: cdn.jsdelivr.net/gh/dresar/ProSkillAI@main/...
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3.5 rounded-[6px] border border-border bg-surface text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        defaultFolder={activeFolder === "all" ? "general" : activeFolder}
        onSuccess={(newItems) => {
          setItems((prev) => [...newItems, ...prev]);
          if (newItems[0] && onSelect) {
            onSelect(newItems[0].cdnUrl, newItems[0]);
            onClose();
          }
        }}
      />
    </div>
  );
}
